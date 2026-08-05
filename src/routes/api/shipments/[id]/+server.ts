import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { shipmentRepository } from '$lib/server/repositories'
import { toShipmentFormData } from '$lib/server/shipment-payload'
import { requireUser } from '$lib/server/guard'

function parseId(raw: string): number | null {
  const id = parseInt(raw)
  return isNaN(id) ? null : id
}

/**
 * GET /api/shipments/[id]
 * Retrieve one of the signed-in user's shipments.
 */
export const GET: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const id = parseId(event.params.id!)
    if (id === null) {
      return json({ error: 'Invalid shipment ID' }, { status: 400 })
    }

    // findById is scoped to the user, so another user's id simply returns null.
    const shipment = await shipmentRepository.findById(id, user.id)
    if (!shipment) {
      return json({ error: 'Shipment not found' }, { status: 404 })
    }

    return json({ shipment })
  } catch (err) {
    console.error('Error fetching shipment:', err)
    return json({ error: 'Failed to load shipment' }, { status: 500 })
  }
}

/**
 * PUT /api/shipments/[id]
 * Update a draft shipment. Finalized shipments are immutable.
 */
export const PUT: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const id = parseId(event.params.id!)
    if (id === null) {
      return json({ error: 'Invalid shipment ID' }, { status: 400 })
    }

    const existing = await shipmentRepository.findById(id, user.id)
    if (!existing) {
      return json({ error: 'Shipment not found' }, { status: 404 })
    }

    if (existing.status !== 'draft') {
      return json({ error: 'Only drafts can be edited' }, { status: 400 })
    }

    const body = await event.request.json()
    const formData = toShipmentFormData(body)

    const rates = body?.rates ?? {}
    const rateData = {
      base: Number(rates.base) || 0,
      insurance: Number(rates.insurance) || 0,
      signature: Number(rates.signature) || 0,
      packaging: Number(rates.packaging) || 0,
      total: Number(rates.total) || 0,
    }

    const shipment = await shipmentRepository.update(id, user.id, formData, rateData)

    return json(shipment)
  } catch (err) {
    console.error('Error updating shipment:', err)
    return json(
      {
        error: 'Failed to update shipment',
        details: err instanceof Error ? err.message : undefined,
      },
      { status: 400 }
    )
  }
}

/**
 * DELETE /api/shipments/[id]
 * Delete a draft, or cancel a finalized shipment.
 */
export const DELETE: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const id = parseId(event.params.id!)
    if (id === null) {
      return json({ error: 'Invalid shipment ID' }, { status: 400 })
    }

    const existing = await shipmentRepository.findById(id, user.id)
    if (!existing) {
      return json({ error: 'Shipment not found' }, { status: 404 })
    }

    await shipmentRepository.delete(id, user.id)

    return json({
      success: true,
      message:
        existing.status === 'draft'
          ? 'Shipment deleted successfully'
          : 'Shipment cancelled successfully',
    })
  } catch (err) {
    console.error('Error deleting shipment:', err)
    return json({ error: 'Failed to delete shipment' }, { status: 500 })
  }
}
