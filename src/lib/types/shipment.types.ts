/**
 * Shipment Type Definitions
 * Centralized shipment-related types for the application
 */

/**
 * Address/Location information
 * Used for both sender (from) and receiver (to) addresses
 */
export interface ShipmentAddress {
  name: string
  phone: string
  country: string
  city: string
  street: string
  postalCode: string
}

/**
 * Package dimensions and details
 */
export interface ShipmentPackage {
  weight: number
  length: number
  width: number
  height: number
  description?: string
}

/**
 * Service selection and shipment type
 */
export interface ShipmentService {
  type: string
  shipmentType: 'Domestic' | 'IntraGulf' | 'International'
  pickupMethod: 'home' | 'postal_office'
}

/**
 * Additional service options
 */
export interface ShipmentOptions {
  signature: boolean
  liquid: boolean
  insurance: boolean
  packaging: boolean
}

/**
 * Rate breakdown and pricing
 */
export interface ShipmentRate {
  base: number
  total: number
  signature: number
  insurance: number
  packaging: number
  liquid: number
}

/**
 * Complete shipment entity
 * Structured representation with nested objects
 */
export interface Shipment {
  id: number
  trackingNumber: string
  status: 'draft' | 'finalized'
  from: ShipmentAddress
  to: ShipmentAddress
  package: ShipmentPackage
  service: ShipmentService
  options: ShipmentOptions
  rate: ShipmentRate
  createdAt: Date
  updatedAt: Date
}

/**
 * Flat form data structure
 * Used for form input and API requests
 */
export interface ShipmentFormData {
  senderName: string
  senderStreet: string
  senderCity: string
  senderPostalCode: string
  senderCountry: string
  senderPhone: string
  receiverName: string
  receiverStreet: string
  receiverCity: string
  receiverPostalCode: string
  receiverCountry: string
  receiverPhone: string
  weight: number
  length: number
  width: number
  height: number
  pickupMethod: string
  serviceType: string
  signatureRequired: boolean
  containsLiquid: boolean
  itemDescription?: string
  shipmentType?: string
  insurance?: boolean
  packaging?: boolean
}

/**
 * Filters for querying shipments
 */
export interface ShipmentFilters {
  status?: string
  shipmentType?: string
  sortBy?: 'createdAt' | 'totalCost' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
