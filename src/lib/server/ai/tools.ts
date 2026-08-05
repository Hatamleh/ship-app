import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { shipmentRepository } from '$lib/server/repositories'
import { calculateRate } from '$lib/server/services/rate-calculator'
import {
  determineShipmentType,
  validateSenderData,
  validateReceiverData,
  validatePackageData,
  validateAdditionalOptions,
} from '$lib/server/validators/shipment-validator'
import serviceCardRules from '$lib/rules/service-card.json'
import countriesData from '$lib/rules/countries.json'
import { retrieve } from './retriever'

/**
 * Every tool is built for one specific authenticated user.
 *
 * The userId comes from the JWT cookie on the server and is closed over here —
 * it is never part of a tool's Zod schema, so the model cannot supply, guess or
 * be talked into changing it. A prompt-injected "show me shipment TR123456789"
 * still resolves through findById(id, userId) and returns nothing if that
 * shipment belongs to someone else.
 */
export function buildTools(userId: number) {
  const searchShipments = tool(
    async ({ status, shipmentType, limit }) => {
      const { shipments, total } = await shipmentRepository.findByUserId(userId, {
        status,
        shipmentType,
        limit: limit ?? 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      } as any)

      return JSON.stringify({
        total,
        returned: shipments.length,
        shipments: shipments.map((s) => ({
          id: s.id,
          trackingNumber: s.trackingNumber,
          status: s.status,
          from: `${s.from.city}, ${s.from.country}`,
          to: `${s.to.city}, ${s.to.country}`,
          shipmentType: s.service.shipmentType,
          serviceType: s.service.type,
          weightKg: s.package.weight,
          totalPrice: s.rate.total,
          createdAt: s.createdAt,
        })),
      })
    },
    {
      name: 'search_shipments',
      description:
        "List the signed-in user's own shipments. Use this for questions like 'how many shipments do I have', 'show my drafts', or 'what did I send to Egypt'. Returns at most `limit` shipments, newest first.",
      schema: z.object({
        status: z
          .enum(['all', 'draft', 'finalized'])
          .optional()
          .describe('Filter by status. Omit or use "all" for every status.'),
        shipmentType: z
          .enum(['all', 'Domestic', 'IntraGulf', 'International'])
          .optional()
          .describe('Filter by shipment type. Omit or use "all" for every type.'),
        limit: z.number().int().min(1).max(50).optional().describe('Max results (default 10).'),
      }),
    }
  )

  const getShipment = tool(
    async ({ trackingNumber, id }) => {
      if (!trackingNumber && id === undefined) {
        return JSON.stringify({ error: 'Provide either trackingNumber or id.' })
      }

      // Look the shipment up within this user's own shipments only.
      let shipment = null
      if (id !== undefined) {
        shipment = await shipmentRepository.findById(id, userId)
      } else {
        const { shipments } = await shipmentRepository.findByUserId(userId, {
          limit: 200,
        } as any)
        shipment = shipments.find((s) => s.trackingNumber === trackingNumber) ?? null
      }

      if (!shipment) {
        return JSON.stringify({
          error: 'No such shipment belongs to you.',
        })
      }

      return JSON.stringify(shipment)
    },
    {
      name: 'get_shipment',
      description:
        "Get the full details of one of the signed-in user's shipments by tracking number or id. Returns an error if the shipment does not belong to them.",
      schema: z.object({
        trackingNumber: z.string().optional().describe('Tracking number, e.g. TR123456789'),
        id: z.number().int().optional().describe('Numeric shipment id'),
      }),
    }
  )

  const quotePrice = tool(
    async (input) => {
      try {
        const result = calculateRate({
          serviceId: input.serviceId,
          weight: input.weight,
          senderCountry: input.senderCountry,
          receiverCountry: input.receiverCountry,
          pickupMethod: input.pickupMethod,
          signatureRequired: input.signatureRequired ?? false,
          containsLiquid: input.containsLiquid ?? false,
          insurance: input.insurance ?? false,
          packaging: input.packaging ?? false,
        })
        return JSON.stringify({
          shipmentType: determineShipmentType(input.senderCountry, input.receiverCountry),
          ...result,
        })
      } catch (e) {
        return JSON.stringify({ error: e instanceof Error ? e.message : 'Rate calculation failed' })
      }
    },
    {
      name: 'quote_price',
      description:
        'Calculate the exact price of a shipment using the real pricing engine. Always use this instead of doing the arithmetic yourself — the numbers must match what the app charges. Call list_services first if you do not know the serviceId.',
      schema: z.object({
        serviceId: z
          .string()
          .describe(
            'Service id, e.g. domestic_standard, domestic_express, gulf_standard, gulf_express, international_economy, international_standard'
          ),
        weight: z.number().positive().describe('Package weight in kg'),
        senderCountry: z.string().describe('Sender country, English name e.g. "Saudi Arabia"'),
        receiverCountry: z.string().describe('Receiver country, English name e.g. "Egypt"'),
        pickupMethod: z.enum(['home', 'postal_office']).describe('How the package is collected'),
        signatureRequired: z.boolean().optional(),
        containsLiquid: z.boolean().optional(),
        insurance: z.boolean().optional(),
        packaging: z.boolean().optional(),
      }),
    }
  )

  const checkRules = tool(
    async (input) => {
      const shipmentType = determineShipmentType(input.senderCountry, input.receiverCountry)

      const data: any = {
        senderName: input.senderName ?? 'Placeholder Name',
        senderPhone: input.senderPhone ?? '0000000000',
        senderCountry: input.senderCountry,
        senderCity: input.senderCity ?? 'Placeholder City',
        senderStreet: input.senderStreet ?? '',
        senderPostalCode: input.senderPostalCode ?? '00000',
        receiverName: input.receiverName ?? 'Placeholder Name',
        receiverPhone: input.receiverPhone ?? '0000000000',
        receiverCountry: input.receiverCountry,
        receiverCity: input.receiverCity ?? 'Placeholder City',
        receiverStreet: input.receiverStreet ?? '',
        receiverPostalCode: input.receiverPostalCode ?? '00000',
        weight: input.weight,
        length: input.length ?? 10,
        width: input.width ?? 10,
        height: input.height ?? 10,
        itemDescription: input.itemDescription ?? '',
        pickupMethod: input.pickupMethod ?? 'home',
        signatureRequired: input.signatureRequired ?? false,
      }

      const errors = {
        ...validateSenderData(data).errors,
        ...validateReceiverData(data, input.senderCountry).errors,
        ...validatePackageData(data, shipmentType).errors,
        ...validateAdditionalOptions(data).errors,
      }

      return JSON.stringify({
        shipmentType,
        allowed: Object.keys(errors).length === 0,
        violations: errors,
        note: 'Fields not supplied were filled with valid placeholders, so only the rules relevant to the supplied fields are meaningful.',
      })
    },
    {
      name: 'check_rules',
      description:
        'Check a proposed shipment against the real business rules (Gulf street requirement, Gulf-to-Iraq block, weight limits per shipment type, mandatory signature for Jordan/Egypt, home-pickup weight limit and the Iraq exception, item description for non-Gulf to Gulf). Use this to answer "can I ship X to Y" questions.',
      schema: z.object({
        senderCountry: z.string().describe('Sender country, English name'),
        receiverCountry: z.string().describe('Receiver country, English name'),
        weight: z.number().positive().describe('Package weight in kg'),
        pickupMethod: z.enum(['home', 'postal_office']).optional(),
        signatureRequired: z.boolean().optional(),
        itemDescription: z.string().optional(),
        senderStreet: z.string().optional(),
        receiverStreet: z.string().optional(),
        senderName: z.string().optional(),
        senderPhone: z.string().optional(),
        senderCity: z.string().optional(),
        senderPostalCode: z.string().optional(),
        receiverName: z.string().optional(),
        receiverPhone: z.string().optional(),
        receiverCity: z.string().optional(),
        receiverPostalCode: z.string().optional(),
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    }
  )

  const listServices = tool(
    async ({ senderCountry, receiverCountry, weight }) => {
      const shipmentType = determineShipmentType(senderCountry, receiverCountry)
      const all = serviceCardRules.servicesByShipmentType[shipmentType] ?? []
      const available = weight ? all.filter((s: any) => weight <= s.maxWeight) : all

      return JSON.stringify({
        shipmentType,
        services: available,
        excludedForWeight: weight
          ? all.filter((s: any) => weight > s.maxWeight).map((s: any) => s.id)
          : [],
      })
    },
    {
      name: 'list_services',
      description:
        'List the shipping services available for a route, optionally filtered by weight. Use this to find the correct serviceId before calling quote_price.',
      schema: z.object({
        senderCountry: z.string().describe('Sender country, English name'),
        receiverCountry: z.string().describe('Receiver country, English name'),
        weight: z.number().positive().optional().describe('Package weight in kg'),
      }),
    }
  )

  const searchPolicyDocs = tool(
    async ({ query, k }) => {
      const chunks = await retrieve(query, k ?? 4)
      if (chunks.length === 0) {
        return JSON.stringify({
          results: [],
          note: 'No indexed documentation. Run `npm run ingest`.',
        })
      }
      return JSON.stringify({
        results: chunks.map((c) => ({
          source: c.source,
          heading: c.heading,
          score: Number(c.score.toFixed(4)),
          content: c.content,
        })),
      })
    },
    {
      name: 'search_policy_docs',
      description:
        'Search the shipping policy documentation (business rules, user stories, rate configuration) for background, definitions and explanations. Use this for "why" and "what is the policy" questions. For a specific yes/no on a concrete shipment, prefer check_rules.',
      schema: z.object({
        query: z.string().describe('What to look up'),
        k: z.number().int().min(1).max(10).optional().describe('How many passages (default 4)'),
      }),
    }
  )

  const listCountries = tool(
    async () =>
      JSON.stringify({
        countries: countriesData.countries.map((c) => ({
          name: c.name,
          isGulf: c.isGulf,
        })),
      }),
    {
      name: 'list_countries',
      description:
        'List the countries this app ships to and whether each is a Gulf country. Use this when the user names a country you need to classify.',
      schema: z.object({}),
    }
  )

  const createDraft = tool(
    async (input) => {
      if (!input.confirm) {
        return JSON.stringify({
          created: false,
          error:
            'Not created. Show the user the full details and the quoted price, then call again with confirm: true once they agree.',
        })
      }

      const shipmentType = determineShipmentType(input.senderCountry, input.receiverCountry)

      const formData: any = {
        senderName: input.senderName,
        senderPhone: input.senderPhone,
        senderCountry: input.senderCountry,
        senderCity: input.senderCity,
        senderStreet: input.senderStreet ?? '',
        senderPostalCode: input.senderPostalCode,
        receiverName: input.receiverName,
        receiverPhone: input.receiverPhone,
        receiverCountry: input.receiverCountry,
        receiverCity: input.receiverCity,
        receiverStreet: input.receiverStreet ?? '',
        receiverPostalCode: input.receiverPostalCode,
        weight: input.weight,
        length: input.length,
        width: input.width,
        height: input.height,
        itemDescription: input.itemDescription ?? '',
        shipmentType,
        serviceType: input.serviceId,
        pickupMethod: input.pickupMethod,
        signatureRequired: input.signatureRequired ?? false,
        containsLiquid: input.containsLiquid ?? false,
        insurance: input.insurance ?? false,
        packaging: input.packaging ?? false,
      }

      // Enforce the same business rules the form enforces. The agent does not
      // get a back door around validation.
      const errors = {
        ...validateSenderData(formData).errors,
        ...validateReceiverData(formData, formData.senderCountry).errors,
        ...validatePackageData(formData, shipmentType).errors,
        ...validateAdditionalOptions(formData).errors,
      }
      if (Object.keys(errors).length > 0) {
        return JSON.stringify({ created: false, violations: errors })
      }

      // Price is always computed server-side, never taken from the model.
      let rate
      try {
        rate = calculateRate({
          serviceId: input.serviceId,
          weight: input.weight,
          senderCountry: input.senderCountry,
          receiverCountry: input.receiverCountry,
          pickupMethod: input.pickupMethod,
          signatureRequired: formData.signatureRequired,
          containsLiquid: formData.containsLiquid,
          insurance: formData.insurance,
          packaging: formData.packaging,
        })
      } catch (e) {
        return JSON.stringify({
          created: false,
          error: e instanceof Error ? e.message : 'Rate calculation failed',
        })
      }

      const shipment = await shipmentRepository.create(userId, formData, {
        base: rate.breakdown.baseCost,
        total: rate.totalPrice,
        signature: rate.breakdown.signatureCost,
        insurance: rate.breakdown.insuranceCost,
        packaging: rate.breakdown.packagingCost,
      })

      return JSON.stringify({
        created: true,
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        totalPrice: shipment.rate.total,
      })
    },
    {
      name: 'create_draft_shipment',
      description:
        "Create a DRAFT shipment on the signed-in user's account. Two-step: call once with confirm false (or omitted) to validate and price it, show the user what will be created, then call again with confirm true. Never pass confirm true before the user has agreed to the details.",
      schema: z.object({
        confirm: z
          .boolean()
          .optional()
          .describe('Must be true to actually write. Omit on the first call.'),
        senderName: z.string(),
        senderPhone: z.string(),
        senderCountry: z.string(),
        senderCity: z.string(),
        senderStreet: z.string().optional(),
        senderPostalCode: z.string(),
        receiverName: z.string(),
        receiverPhone: z.string(),
        receiverCountry: z.string(),
        receiverCity: z.string(),
        receiverStreet: z.string().optional(),
        receiverPostalCode: z.string(),
        weight: z.number().positive(),
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
        itemDescription: z.string().optional(),
        serviceId: z.string().describe('Service id from list_services'),
        pickupMethod: z.enum(['home', 'postal_office']),
        signatureRequired: z.boolean().optional(),
        containsLiquid: z.boolean().optional(),
        insurance: z.boolean().optional(),
        packaging: z.boolean().optional(),
      }),
    }
  )

  return [
    searchShipments,
    getShipment,
    quotePrice,
    checkRules,
    listServices,
    searchPolicyDocs,
    listCountries,
    createDraft,
  ]
}
