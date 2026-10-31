import type { APIRequestContext, APIResponse } from '@playwright/test'

export interface ShipmentAddress {
  name: string
  phone: string
  country: string
  city: string
  street: string
  postalCode: string
}

export interface DraftShipmentPayload {
  from: ShipmentAddress
  to: ShipmentAddress
  package: { weight: number; length: number; width: number; height: number; description: string }
  service: { type: string; pickupMethod: string; shipmentType?: string }
  additional: { signature: boolean; liquid: boolean; insurance: boolean; packaging: boolean }
  rates: { base: number; signature: number; insurance: number; packaging: number; total: number }
}

/** Static API client for /api/shipments/*. Pass `page.request` so the login cookie is used. */
export class ShipmentsClient {
  static async saveDraft(
    request: APIRequestContext,
    payload: DraftShipmentPayload,
  ): Promise<APIResponse> {
    return request.post('/api/shipments/draft', { data: payload })
  }
}
