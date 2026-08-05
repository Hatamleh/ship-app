/**
 * Shipment Validation Service
 * Centralizes all business rule validations for shipments
 * Ensures backend enforcement of all 130+ business rules
 */

import countriesData from '$lib/rules/countries.json'
import packageCardRules from '$lib/rules/package-card.json'
import type { ShipmentFormData, ShipmentType } from '$lib/types'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Check if a country is a Gulf country.
 * Exported so the rules API routes share this single definition instead of
 * keeping their own copies, which is how the two previously drifted apart.
 */
export function isGulfCountry(countryName: string): boolean {
  const country = countriesData.countries.find((c) => c.name === countryName)
  return country?.isGulf || false
}

/**
 * Determine shipment type based on sender and receiver countries
 */
export function determineShipmentType(
  senderCountry: string,
  receiverCountry: string
): ShipmentType {
  // Same country = Domestic
  if (senderCountry === receiverCountry) {
    return 'Domestic'
  }

  // Both are Gulf countries = IntraGulf
  if (isGulfCountry(senderCountry) && isGulfCountry(receiverCountry)) {
    return 'IntraGulf'
  }

  // Otherwise = International
  return 'International'
}

/**
 * Validate sender data against business rules
 */
export function validateSenderData(data: Partial<ShipmentFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate required fields
  if (!data.senderName || data.senderName.trim().length < 2) {
    errors.senderName = 'Sender name must be at least 2 characters'
  }

  if (!data.senderPhone) {
    errors.senderPhone = 'Sender phone number is required'
  } else {
    // Phone validation: at least 10 digits
    const digits = data.senderPhone.replace(/\D/g, '')
    if (digits.length < 10) {
      errors.senderPhone = 'Phone number must contain at least 10 digits'
    }
  }

  if (!data.senderCountry) {
    errors.senderCountry = 'Sender country is required'
  }

  if (!data.senderCity || data.senderCity.trim().length < 2) {
    errors.senderCity = 'Sender city must be at least 2 characters'
  }

  if (!data.senderPostalCode || data.senderPostalCode.trim().length < 3) {
    errors.senderPostalCode = 'Sender postal code must be at least 3 characters'
  }

  // Business Rule: Street is required for Gulf countries
  const isSenderGulf = data.senderCountry ? isGulfCountry(data.senderCountry) : false
  if (isSenderGulf) {
    if (!data.senderStreet || data.senderStreet.trim().length === 0) {
      errors.senderStreet = 'Street address is required for Gulf countries'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate receiver data against business rules
 */
export function validateReceiverData(
  data: Partial<ShipmentFormData>,
  senderCountry?: string
): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate required fields
  if (!data.receiverName || data.receiverName.trim().length < 2) {
    errors.receiverName = 'Receiver name must be at least 2 characters'
  }

  if (!data.receiverPhone) {
    errors.receiverPhone = 'Receiver phone number is required'
  } else {
    // Phone validation: at least 10 digits
    const digits = data.receiverPhone.replace(/\D/g, '')
    if (digits.length < 10) {
      errors.receiverPhone = 'Phone number must contain at least 10 digits'
    }
  }

  if (!data.receiverCountry) {
    errors.receiverCountry = 'Receiver country is required'
  }

  if (!data.receiverCity || data.receiverCity.trim().length < 2) {
    errors.receiverCity = 'Receiver city must be at least 2 characters'
  }

  if (!data.receiverPostalCode || data.receiverPostalCode.trim().length < 3) {
    errors.receiverPostalCode = 'Receiver postal code must be at least 3 characters'
  }

  // Business Rule: Street is required for Gulf countries
  const isReceiverGulf = data.receiverCountry ? isGulfCountry(data.receiverCountry) : false
  if (isReceiverGulf) {
    if (!data.receiverStreet || data.receiverStreet.trim().length === 0) {
      errors.receiverStreet = 'Street address is required for Gulf countries'
    }
  }

  // Business Rule: Cannot ship from Gulf to Iraq
  if (senderCountry && data.receiverCountry) {
    const isSenderGulf = isGulfCountry(senderCountry)
    if (isSenderGulf && data.receiverCountry === 'Iraq') {
      errors.receiverCountry =
        'Shipping from Gulf countries to Iraq is not currently available'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate package data against business rules
 */
export function validatePackageData(
  data: Partial<ShipmentFormData>,
  shipmentType: ShipmentType
): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate weight
  if (!data.weight || data.weight <= 0) {
    errors.weight = 'Weight must be greater than 0 kg'
  } else {
    // Get max weight for shipment type
    const typeRules = packageCardRules.shipmentTypes[shipmentType]
    if (typeRules && data.weight > typeRules.maxWeight) {
      errors.weight = `Weight cannot exceed ${typeRules.maxWeight} kg for ${shipmentType} shipments`
    }
  }

  // Validate dimensions
  if (!data.length || data.length <= 0) {
    errors.length = 'Length must be greater than 0 cm'
  } else if (data.length > 200) {
    errors.length = 'Length cannot exceed 200 cm'
  }

  if (!data.width || data.width <= 0) {
    errors.width = 'Width must be greater than 0 cm'
  } else if (data.width > 200) {
    errors.width = 'Width cannot exceed 200 cm'
  }

  if (!data.height || data.height <= 0) {
    errors.height = 'Height must be greater than 0 cm'
  } else if (data.height > 200) {
    errors.height = 'Height cannot exceed 200 cm'
  }

  // Business Rule: Item description required for non-Gulf to Gulf shipments
  if (data.senderCountry && data.receiverCountry) {
    const isSenderGulf = isGulfCountry(data.senderCountry)
    const isReceiverGulf = isGulfCountry(data.receiverCountry)
    const isNonGulfToGulf = !isSenderGulf && isReceiverGulf

    if (isNonGulfToGulf) {
      if (!data.itemDescription || data.itemDescription.trim().length < 5) {
        errors.itemDescription =
          'Item description is required (minimum 5 characters) when shipping from outside the Gulf into a Gulf country'
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate additional options against business rules
 */
export function validateAdditionalOptions(data: Partial<ShipmentFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Business Rule: Signature required for Jordan and Egypt
  if (data.receiverCountry === 'Jordan' || data.receiverCountry === 'Egypt') {
    if (!data.signatureRequired) {
      errors.signatureRequired = `Signature is required when shipping to ${data.receiverCountry}`
    }
  }

  // Business Rule: Home pickup disabled for packages > 17kg (except Iraq)
  if (data.weight && data.weight > 17 && data.senderCountry !== 'Iraq') {
    if (data.pickupMethod === 'home') {
      errors.pickupMethod =
        'Home pickup is not available for packages over 17 kg. Please choose drop off at a postal office'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate service selection
 */
export function validateServiceSelection(data: Partial<ShipmentFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.serviceType) {
    errors.serviceType = 'Service type is required'
  }

  if (!data.shipmentType) {
    errors.shipmentType = 'Shipment type is required'
  }

  if (!data.pickupMethod) {
    errors.pickupMethod = 'Pickup method is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate complete shipment data (for finalization)
 * Runs all validation checks
 */
export function validateCompleteShipment(data: ShipmentFormData): ValidationResult {
  const allErrors: Record<string, string> = {}

  // Determine shipment type
  const shipmentType = determineShipmentType(data.senderCountry, data.receiverCountry)

  // Run all validations
  const senderValidation = validateSenderData(data)
  const receiverValidation = validateReceiverData(data, data.senderCountry)
  const packageValidation = validatePackageData(data, shipmentType)
  const optionsValidation = validateAdditionalOptions(data)
  const serviceValidation = validateServiceSelection(data)

  // Merge all errors
  Object.assign(allErrors, senderValidation.errors)
  Object.assign(allErrors, receiverValidation.errors)
  Object.assign(allErrors, packageValidation.errors)
  Object.assign(allErrors, optionsValidation.errors)
  Object.assign(allErrors, serviceValidation.errors)

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
  }
}

/**
 * Validate draft shipment data (minimal validation)
 * Only checks data types and basic structure
 */
export function validateDraftShipment(data: Partial<ShipmentFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Only validate that if data exists, it's in the right format
  if (data.weight !== undefined && (isNaN(Number(data.weight)) || Number(data.weight) < 0)) {
    errors.weight = 'Weight must be a valid number'
  }

  if (data.length !== undefined && (isNaN(Number(data.length)) || Number(data.length) < 0)) {
    errors.length = 'Length must be a valid number'
  }

  if (data.width !== undefined && (isNaN(Number(data.width)) || Number(data.width) < 0)) {
    errors.width = 'Width must be a valid number'
  }

  if (data.height !== undefined && (isNaN(Number(data.height)) || Number(data.height) < 0)) {
    errors.height = 'Height must be a valid number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
