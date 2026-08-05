/**
 * Types for the API-driven rules engine
 */

export type FieldType = 'text' | 'select' | 'number' | 'checkbox' | 'radio'

export type ShipmentType = 'Domestic' | 'IntraGulf' | 'International'

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  errorMessage?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface FieldRule {
  type: FieldType
  label: string
  required?: boolean
  validation?: FieldValidation
  options?: SelectOption[]
  defaultValue?: string | number | boolean
  placeholder?: string
  disabled?: boolean
  visible?: boolean
}

export interface CardRules {
  cardName: string
  title: string
  enabled: boolean
  fields: Record<string, FieldRule>
  validationErrors?: Record<string, string>
}

export interface Country {
  code: string
  name: string
  isGulf: boolean
}

export interface ServiceOption {
  id: string
  name: string
  description: string
  maxWeight: number
  basePrice: number
  pricePerKg: number
  deliveryDays: number
}

export interface ServiceRules {
  shipmentType: ShipmentType
  services: ServiceOption[]
}

export interface PackageRules {
  shipmentType: ShipmentType
  maxWeight: number
  maxDimension: number
  fields: Record<string, FieldRule>
}
