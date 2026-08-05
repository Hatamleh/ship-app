import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { shipmentRepository } from '$lib/server/repositories'
import { requireUser } from '$lib/server/guard'

/**
 * GET /api/shipments
 * List the signed-in user's shipments with filtering, sorting and pagination.
 *
 * Query parameters:
 * - status:       draft | finalized | all
 * - shipmentType: Domestic | IntraGulf | International | all
 * - sortBy:       createdAt | totalCost | status
 * - sortOrder:    asc | desc
 * - page, limit
 */
export const GET: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const params = event.url.searchParams

    const filters = {
      status: params.get('status') || undefined,
      shipmentType: params.get('shipmentType') || undefined,
      sortBy: (params.get('sortBy') || 'createdAt') as 'createdAt' | 'totalCost' | 'status',
      sortOrder: (params.get('sortOrder') || 'desc') as 'asc' | 'desc',
      page: parseInt(params.get('page') || '1'),
      limit: parseInt(params.get('limit') || '10'),
    }

    const { shipments, total } = await shipmentRepository.findByUserId(user.id, filters as any)

    return json({
      shipments,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    })
  } catch (err) {
    console.error('Error fetching shipments:', err)
    return json({ error: 'Failed to load shipments' }, { status: 500 })
  }
}

/**
 * POST /api/shipments
 * Create a draft shipment from flat ShipmentFormData.
 */
export const POST: RequestHandler = async (event) => {
  const user = requireUser(event)

  try {
    const body = await event.request.json()

    const rates = {
      base: Number(body.baseCost) || 0,
      insurance: Number(body.insuranceCost) || 0,
      signature: Number(body.signatureCost) || 0,
      packaging: Number(body.packagingCost) || 0,
      total: Number(body.totalCost) || 0,
    }

    const shipment = await shipmentRepository.create(user.id, body, rates)

    return json(shipment, { status: 201 })
  } catch (err) {
    console.error('Error creating shipment:', err)
    return json(
      {
        error: 'Failed to create shipment',
        details: err instanceof Error ? err.message : undefined,
      },
      { status: 400 }
    )
  }
}
