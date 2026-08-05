import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { shipmentRepository } from '@/repositories'
import { validateCompleteShipment, determineShipmentType } from '@/lib/validators/shipment-validator'
import { calculateRateFromFormData } from '@/lib/services/rate-calculator'

/**
 * POST /api/shipments/finalize
 * Create a finalized shipment
 * Full validation + server-side rate calculation
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { user, response } = await requireAuth(request)
    if (response) return response

    const body = await request.json()
    const { from, to, package: pkg, service, additional } = body

    // Convert structured input to flat form data
    const formData = {
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
      shipmentType: service?.shipmentType || determineShipmentType(from?.country, to?.country),
      signatureRequired: additional?.signature || false,
      containsLiquid: additional?.liquid || false,
      insurance: additional?.insurance || false,
      packaging: additional?.packaging || false,
    }

    // STEP 1: Full validation (enforce all 130+ business rules)
    const validation = validateCompleteShipment(formData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          validationErrors: validation.errors,
        },
        { status: 400 }
      )
    }

    // STEP 2: Calculate rates server-side (never trust frontend prices!)
    let rateCalculation
    try {
      rateCalculation = calculateRateFromFormData(formData)
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Failed to calculate cost',
          details: error instanceof Error ? error.message : 'Invalid service or weight',
        },
        { status: 400 }
      )
    }

    // Use the server-calculated rates (ignore frontend-provided rates)
    const rateData = {
      base: rateCalculation.breakdown.baseCost,
      insurance: rateCalculation.breakdown.insuranceCost,
      signature: rateCalculation.breakdown.signatureCost,
      packaging: rateCalculation.breakdown.packagingCost,
      total: rateCalculation.totalPrice,
    }

    // STEP 3: Create draft shipment first
    const draftShipment = await shipmentRepository.create(user!.id, formData, rateData)

    // STEP 4: Then finalize it immediately
    const shipment = await shipmentRepository.finalize(draftShipment.id, user!.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Shipment finalized successfully',
        shipment,
        rateBreakdown: rateCalculation.breakdown,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error finalizing shipment:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to finalize shipment', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to finalize shipment' },
      { status: 500 }
    )
  }
}
