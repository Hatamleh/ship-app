// @ts-nocheck
import type { PageServerLoad } from './$types'
import { shipmentRepository } from '$lib/server/repositories'

/**
 * Loads the shipment list on the server so the table is in the first response
 * rather than appearing after a client fetch.
 *
 * Filters live in the query string, which means a filtered view is a real URL
 * you can share, reload and go back to.
 */
export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
  const status = url.searchParams.get('status') ?? 'all'
  const shipmentType = url.searchParams.get('type') ?? 'all'

  const { shipments } = await shipmentRepository.findByUserId(locals.user!.id, {
    status: status === 'all' ? undefined : status,
    shipmentType: shipmentType === 'all' ? undefined : shipmentType,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 100,
  } as any)

  return { shipments, status, shipmentType }
}
