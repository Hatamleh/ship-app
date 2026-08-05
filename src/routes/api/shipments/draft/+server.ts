import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { shipmentRepository } from '$lib/server/repositories'
import { validateDraftShipment } from '$lib/server/validators/shipment-validator'
import { toShipmentFormData } from '$lib/server/shipment-payload'
import { requireUser } from '$lib/server/guard'

/**
 * POST /api/shipments/draft
 * Save a work-in-progress shipment. Minimal validation only — an incomplete
 * draft is allowed; the business rules are enforced at finalize time.
 */
export const POST: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const body = await event.request.json()
    const formData = toShipmentFormData(body)

    const validation = validateDraftShipment(formData)
    if (!validation.isValid) {
      return json(
        { error: 'Invalid data format', validationErrors: validation.errors },
        { status: 400 }
      )
    }

    // Drafts keep whatever rates the client had computed so far; they are
    // recalculated server-side when the draft is finalized.
    const rates = body?.rates ?? {}
    const rateData = {
      base: Number(rates.base) || 0,
      insurance: Number(rates.insurance) || 0,
      signature: Number(rates.signature) || 0,
      packaging: Number(rates.packaging) || 0,
      total: Number(rates.total) || 0,
    }

    const shipment = await shipmentRepository.create(user.id, formData, rateData)

    return json({ success: true, message: 'Draft saved successfully', shipment }, { status: 201 })
  } catch (err) {
    console.error('Error creating draft shipment:', err)
    return json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
