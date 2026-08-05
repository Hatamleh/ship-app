/**
 * Rate Calculation Service
 * Server-side price calculation to prevent price manipulation
 * Never trust prices sent from the frontend!
 */

import pricingRules from '$lib/rules/pricing.json'
import serviceCardRules from '$lib/rules/service-card.json'
import type { ShipmentFormData, ShipmentType, RateBreakdown } from '$lib/types'

export interface RateCalculationInput {
  serviceId: string
  weight: number
  senderCountry: string
  receiverCountry: string
  pickupMethod: 'home' | 'postal_office'
  signatureRequired: boolean
  containsLiquid: boolean
  insurance?: boolean
  packaging?: boolean
}

export interface RateCalculationResult {
  breakdown: RateBreakdown
  totalPrice: number
  serviceInfo?: {
    name: string
    basePrice: number
    pricePerKg: number
    maxWeight: number
  }
}

/**
 * Find service by ID across all shipment types
 */
function findService(serviceId: string) {
  for (const [shipmentType, services] of Object.entries(serviceCardRules.servicesByShipmentType)) {
    const service = services.find((s: any) => s.id === serviceId)
    if (service) {
      return service
    }
  }
  return null
}

/**
 * Get pickup/dropoff fee for a country
 */
function getPickupFee(country: string, method: 'home' | 'postal_office'): number {
  const countryFees = pricingRules.pickupFees[country as keyof typeof pricingRules.pickupFees]

  if (countryFees) {
    return countryFees[method]
  }

  // Return default fees if country not found
  return pricingRules.defaultPickupFees[method]
}

/**
 * Calculate shipment rate server-side
 * This is the source of truth - never trust frontend calculations
 */
export function calculateRate(input: RateCalculationInput): RateCalculationResult {
  // Find the service
  const service = findService(input.serviceId)

  if (!service) {
    throw new Error(`Service not found: ${input.serviceId}`)
  }

  // Validate weight doesn't exceed service max
  if (input.weight > service.maxWeight) {
    throw new Error(`Weight ${input.weight}kg exceeds service maximum of ${service.maxWeight}kg`)
  }

  // Calculate base shipping cost
  const serviceBaseCost = service.basePrice + (input.weight * service.pricePerKg)

  // Get pickup/dropoff fee
  const pickupFee = getPickupFee(input.senderCountry, input.pickupMethod)

  // Calculate additional fees
  const signatureCost = input.signatureRequired ? pricingRules.additionalFees.signature : 0
  const liquidCost = input.containsLiquid ? pricingRules.additionalFees.liquid : 0
  const insuranceCost = input.insurance ? pricingRules.additionalFees.insurance : 0
  const packagingCost = input.packaging ? pricingRules.additionalFees.packaging : 0

  // Calculate total
  const baseCost = serviceBaseCost + pickupFee
  const totalPrice = baseCost + signatureCost + liquidCost + insuranceCost + packagingCost

  return {
    breakdown: {
      baseCost: parseFloat(baseCost.toFixed(2)),
      signatureCost: parseFloat(signatureCost.toFixed(2)),
      insuranceCost: parseFloat(insuranceCost.toFixed(2)),
      packagingCost: parseFloat(packagingCost.toFixed(2)),
      liquidCost: parseFloat(liquidCost.toFixed(2)),
    },
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    serviceInfo: {
      name: service.name,
      basePrice: service.basePrice,
      pricePerKg: service.pricePerKg,
      maxWeight: service.maxWeight,
    },
  }
}

/**
 * Calculate rate from ShipmentFormData
 * Convenience method that extracts rate calculation input from form data
 */
export function calculateRateFromFormData(data: ShipmentFormData): RateCalculationResult {
  if (!data.serviceType) {
    throw new Error('Service type is required for rate calculation')
  }

  return calculateRate({
    serviceId: data.serviceType,
    weight: data.weight,
    senderCountry: data.senderCountry,
    receiverCountry: data.receiverCountry,
    pickupMethod: data.pickupMethod as 'home' | 'postal_office',
    signatureRequired: data.signatureRequired,
    containsLiquid: data.containsLiquid,
    insurance: data.insurance,
    packaging: data.packaging,
  })
}

/**
 * Validate that frontend-provided rates match backend calculation
 * Use this to detect price manipulation attempts
 */
export function validateRates(
  frontendRates: { base: number; total: number },
  backendCalculation: RateCalculationResult
): boolean {
  // Allow small floating point differences (0.01)
  const baseDiff = Math.abs(frontendRates.base - backendCalculation.breakdown.baseCost)
  const totalDiff = Math.abs(frontendRates.total - backendCalculation.totalPrice)

  return baseDiff < 0.01 && totalDiff < 0.01
}
