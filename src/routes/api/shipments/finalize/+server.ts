import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { shipmentRepository } from '$lib/server/repositories'
import { validateCompleteShipment } from '$lib/server/validators/shipment-validator'
import { calculateRateFromFormData } from '$lib/server/services/rate-calculator'
import { toShipmentFormData } from '$lib/server/shipment-payload'
import { requireUser } from '$lib/server/guard'

/**
 * POST /api/shipments/finalize
 * Create a finalized shipment: full business-rule validation, then a
 * server-side rate calculation. Prices sent by the client are ignored.
 */
export const POST: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const formData = toShipmentFormData(await event.request.json())

    // Enforce every business rule. This is the check that a request bypassing
    // the UI has to get past.
    const validation = validateCompleteShipment(formData)
    if (!validation.isValid) {
      return json(
        { error: 'Validation failed', validationErrors: validation.errors },
        { status: 400 }
      )
    }

    let rateCalculation
    try {
      rateCalculation = calculateRateFromFormData(formData)
    } catch (err) {
      return json(
        {
          error: 'Failed to calculate cost',
          details: err instanceof Error ? err.message : 'Invalid service or weight',
        },
        { status: 400 }
      )
    }

    const rateData = {
      base: rateCalculation.breakdown.baseCost,
      insurance: rateCalculation.breakdown.insuranceCost,
      signature: rateCalculation.breakdown.signatureCost,
      packaging: rateCalculation.breakdown.packagingCost,
      total: rateCalculation.totalPrice,
    }

    const draft = await shipmentRepository.create(user.id, formData, rateData)
    const shipment = await shipmentRepository.finalize(draft.id, user.id)

    return json(
      {
        success: true,
        message: 'Shipment finalized successfully',
        shipment,
        rateBreakdown: rateCalculation.breakdown,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Error finalizing shipment:', err)
    return json(
      {
        error: 'Failed to finalize shipment',
        details: err instanceof Error ? err.message : undefined,
      },
      { status: 400 }
    )
  }
}
