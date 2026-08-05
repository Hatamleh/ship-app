import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { shipmentRepository } from '$lib/server/repositories'

/**
 * Loads the shipment on the server.
 *
 * The React version fetched this from the browser after mount and rendered a
 * loading state. Here it arrives with the page, and a shipment belonging to
 * someone else is a clean 404 because findById is scoped to the user.
 */
export const load: PageServerLoad = async ({ params, locals }) => {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    error(400, 'Invalid shipment ID')
  }

  const shipment = await shipmentRepository.findById(id, locals.user!.id)
  if (!shipment) {
    error(404, 'Shipment not found')
  }

  return { shipment }
}
