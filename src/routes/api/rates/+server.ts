import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { calculateRate } from '$lib/server/services/rate-calculator'
import { determineShipmentType } from '$lib/server/validators/shipment-validator'
import serviceCardRules from '$lib/rules/service-card.json'

/**
 * POST /api/rates
 * Calculates the total rate for a service, weight, route and options.
 *
 * This delegates to calculateRate() rather than repeating the pricing maths.
 * The Next version had its own copy, which is exactly how the two Gulf-country
 * lookups drifted apart previously.
 *
 * Request body:
 * - serviceId, weight, senderCountry, receiverCountry, pickupMethod (all required)
 * - signatureRequired, containsLiquid, insurance, packaging (optional)
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json()
    const {
      serviceId,
      weight,
      senderCountry,
      receiverCountry,
      pickupMethod,
      signatureRequired,
      containsLiquid,
      insurance,
      packaging,
    } = body

    if (!serviceId || !weight || !senderCountry || !receiverCountry || !pickupMethod) {
      return json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    // Confirm the service exists before pricing it, so a bad id is a 404 rather
    // than a generic failure.
    const known = Object.values(serviceCardRules.servicesByShipmentType)
      .flat()
      .some((s: any) => s.id === serviceId)

    if (!known) {
      return json({ error: 'Service not found' }, { status: 404 })
    }

    const result = calculateRate({
      serviceId,
      weight: Number(weight),
      senderCountry,
      receiverCountry,
      pickupMethod,
      signatureRequired: !!signatureRequired,
      containsLiquid: !!containsLiquid,
      insurance: !!insurance,
      packaging: !!packaging,
    })

    return json({
      totalPrice: result.totalPrice,
      breakdown: result.breakdown,
      context: {
        serviceName: result.serviceInfo?.name,
        shipmentType: determineShipmentType(senderCountry, receiverCountry),
        weight: Number(weight),
        senderCountry,
        receiverCountry,
        pickupMethod,
      },
    })
  } catch (err) {
    // calculateRate throws for an over-weight service, which is a client error
    const message = err instanceof Error ? err.message : 'Failed to calculate price'
    if (message.includes('exceeds service maximum')) {
      return json({ error: message }, { status: 400 })
    }
    console.error('Error calculating rate:', err)
    return json({ error: 'Failed to calculate price' }, { status: 500 })
  }
}
