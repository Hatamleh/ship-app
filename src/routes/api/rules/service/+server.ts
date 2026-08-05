import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import serviceCardRules from '$lib/rules/service-card.json'
import type { ShipmentType } from '$lib/types'

/**
 * POST /api/rules/service
 * Returns the available services for a shipment type, filtered by weight
 *
 * Request body:
 * - shipmentType: (required) Domestic | IntraGulf | International
 * - package: { weight: number }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { shipmentType, package: pkg } = await request.json()
    const weight = pkg?.weight

    if (!shipmentType) {
      return json({ error: 'shipmentType is required' }, { status: 400 })
    }

    if (!['Domestic', 'IntraGulf', 'International'].includes(shipmentType)) {
      return json({ error: 'Invalid shipment type' }, { status: 400 })
    }

    const services = serviceCardRules.servicesByShipmentType[shipmentType as ShipmentType]

    if (!services) {
      return json({ error: 'No services found for this shipment type' }, { status: 404 })
    }

    // Only offer services that can carry this weight
    let availableServices = services
    const weightNum = parseFloat(weight)
    if (!isNaN(weightNum)) {
      availableServices = services.filter((service: any) => weightNum <= service.maxWeight)
    }

    return json({
      cardName: serviceCardRules.cardName,
      title: serviceCardRules.title,
      enabled: true,
      shipmentType,
      services: availableServices,
      context: { weight: isNaN(weightNum) ? null : weightNum },
    })
  } catch (err) {
    console.error('Error loading service rules:', err)
    return json({ error: 'Failed to load service rules' }, { status: 500 })
  }
}
