import type { ShipmentFormData } from '$lib/types'
import { determineShipmentType } from './validators/shipment-validator'

/**
 * The API accepts a nested payload (from / to / package / service / additional)
 * while the validators and repository work on flat ShipmentFormData.
 *
 * This conversion was previously copy-pasted into four route handlers, which is
 * how they drifted. It lives here once now.
 */
export function toShipmentFormData(body: any): ShipmentFormData {
  const { from, to, package: pkg, service, additional } = body ?? {}

  return {
    senderName: from?.name || '',
    senderPhone: from?.phone || '',
    senderCountry: from?.country || '',
    senderCity: from?.city || '',
    senderStreet: from?.street || '',
    senderPostalCode: from?.postalCode || '',

    receiverName: to?.name || '',
    receiverPhone: to?.phone || '',
    receiverCountry: to?.country || '',
    receiverCity: to?.city || '',
    receiverStreet: to?.street || '',
    receiverPostalCode: to?.postalCode || '',

    weight: Number(pkg?.weight) || 0,
    length: Number(pkg?.length) || 0,
    width: Number(pkg?.width) || 0,
    height: Number(pkg?.height) || 0,
    itemDescription: pkg?.description || '',

    serviceType: service?.type || '',
    pickupMethod: service?.pickupMethod || 'home',
    shipmentType:
      service?.shipmentType || determineShipmentType(from?.country || '', to?.country || ''),

    signatureRequired: additional?.signature || false,
    containsLiquid: additional?.liquid || false,
    insurance: additional?.insurance || false,
    packaging: additional?.packaging || false,
  } as ShipmentFormData
}
