import { NextRequest, NextResponse } from 'next/server'
import serviceCardRules from '@/lib/rules/service-card.json'
import pricingRules from '@/lib/rules/pricing.json'
import type { ShipmentType } from '@/lib/types'

/**
 * POST /api/rates
 * Calculates the total rate based on service, weight, countries, and options
 *
 * Request body:
 * - serviceId: (required) The selected service ID
 * - weight: (required) Package weight in kg
 * - senderCountry: (required) Sender's country
 * - receiverCountry: (required) Receiver's country
 * - pickupMethod: (required) 'home' or 'postal_office'
 * - signatureRequired: (required) boolean
 * - containsLiquid: (required) boolean
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceId,
      weight,
      senderCountry,
      receiverCountry,
      pickupMethod,
      signatureRequired,
      containsLiquid,
      insurance,
      packaging,
    } = body

    // Validate required parameters
    if (!serviceId || !weight || !senderCountry || !receiverCountry || !pickupMethod) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Find the service
    let selectedService: any = null
    let shipmentType: ShipmentType | null = null

    for (const [type, services] of Object.entries(serviceCardRules.servicesByShipmentType)) {
      const service = services.find((s: any) => s.id === serviceId)
      if (service) {
        selectedService = service
        shipmentType = type as ShipmentType
        break
      }
    }

    if (!selectedService || !shipmentType) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate service base price
    const serviceBase = selectedService.basePrice

    // Calculate weight charge
    const weightCharge = weight * selectedService.pricePerKg

    // Get pickup/drop-off fee based on sender country
    let pickupFee = 0
    const countryFees = pricingRules.pickupFees[senderCountry as keyof typeof pricingRules.pickupFees]

    if (countryFees) {
      pickupFee = countryFees[pickupMethod as keyof typeof countryFees]
    } else {
      // Use default fees for countries not in the list
      pickupFee = pricingRules.defaultPickupFees[pickupMethod as keyof typeof pricingRules.defaultPickupFees]
    }

    // Calculate signature fee
    const signatureFee = signatureRequired ? pricingRules.additionalFees.signature : 0

    // Calculate liquid handling fee
    const liquidFee = containsLiquid ? pricingRules.additionalFees.liquid : 0

    // Calculate insurance fee
    const insuranceFee = insurance ? pricingRules.additionalFees.insurance : 0

    // Calculate packaging fee
    const packagingFee = packaging ? pricingRules.additionalFees.packaging : 0

    // Calculate base cost (service + weight + pickup)
    const baseCost = serviceBase + weightCharge + pickupFee

    // Calculate total price
    const totalPrice = baseCost + signatureFee + liquidFee + insuranceFee + packagingFee

    return NextResponse.json({
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      breakdown: {
        baseCost: parseFloat(baseCost.toFixed(2)),
        signatureCost: parseFloat(signatureFee.toFixed(2)),
        insuranceCost: parseFloat(insuranceFee.toFixed(2)),
        packagingCost: parseFloat(packagingFee.toFixed(2)),
        liquidCost: parseFloat(liquidFee.toFixed(2)),
      },
      context: {
        serviceName: selectedService.name,
        shipmentType,
        weight,
        senderCountry,
        receiverCountry,
        pickupMethod,
      },
    })
  } catch (error) {
    console.error('Error calculating rate:', error)
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    )
  }
}
