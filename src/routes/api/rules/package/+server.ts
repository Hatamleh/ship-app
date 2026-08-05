import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import packageCardRules from '$lib/rules/package-card.json'
import { determineShipmentType, isGulfCountry } from '$lib/server/validators/shipment-validator'

/**
 * POST /api/rules/package
 * Returns the rules for the package card
 *
 * Request body:
 * - from: { country: string }
 * - to:   { country: string }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { from, to } = await request.json()
    const senderCountry = from?.country
    const receiverCountry = to?.country

    if (!senderCountry || !receiverCountry) {
      return json({ error: 'Sender and receiver countries are required' }, { status: 400 })
    }

    const shipmentType = determineShipmentType(senderCountry, receiverCountry)
    const typeRules = packageCardRules.shipmentTypes[shipmentType]

    if (!typeRules) {
      return json({ error: 'Invalid shipment type' }, { status: 400 })
    }

    const rules = JSON.parse(JSON.stringify(packageCardRules))

    if (rules.fields.weight?.validation) {
      rules.fields.weight.validation.max = typeRules.maxWeight
      rules.fields.weight.validation.errorMessage = `Weight must be between 0.1 and ${typeRules.maxWeight} kg`
    }

    // Rule: item description is required when shipping from non-Gulf into Gulf
    const isNonGulfToGulf = !isGulfCountry(senderCountry) && isGulfCountry(receiverCountry)
    if (rules.fields.itemDescription) {
      rules.fields.itemDescription.required = isNonGulfToGulf
      rules.fields.itemDescription.visible = isNonGulfToGulf
      if (rules.fields.itemDescription.validation) {
        rules.fields.itemDescription.validation.required = isNonGulfToGulf
      }
    }

    return json({
      cardName: rules.cardName,
      title: rules.title,
      enabled: true,
      fields: rules.fields,
      shipmentType,
      maxWeight: typeRules.maxWeight,
      maxDimension: typeRules.maxDimension,
      context: { senderCountry, receiverCountry },
    })
  } catch (err) {
    console.error('Error loading package rules:', err)
    return json({ error: 'Failed to load package rules' }, { status: 500 })
  }
}
