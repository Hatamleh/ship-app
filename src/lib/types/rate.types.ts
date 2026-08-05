/**
 * Rate and Pricing Type Definitions
 * Centralized rate calculation and pricing types
 */

/**
 * Detailed breakdown of rate costs
 * Shows individual cost components for transparency
 */
export interface RateBreakdown {
  baseCost: number
  signatureCost: number
  insuranceCost: number
  packagingCost: number
  liquidCost: number
}
