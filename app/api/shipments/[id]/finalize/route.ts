import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { shipmentRepository } from '@/repositories'
import { validateCompleteShipment } from '@/lib/validators/shipment-validator'
import { calculateRateFromFormData } from '@/lib/services/rate-calculator'
import type { ShipmentFormData } from '@/lib/types'

/**
 * POST /api/shipments/[id]/finalize
 * Finalize an existing draft shipment
 * Full validation + server-side rate recalculation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const { user, response } = await requireAuth(request)
    if (response) return response

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid shipment ID' }, { status: 400 })
    }

    // STEP 1: Load and verify shipment exists and belongs to user
    const shipment = await shipmentRepository.findById(id, user!.id)

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Only allow finalizing draft shipments
    if (shipment.status !== 'draft') {
      return NextResponse.json({ error: 'Shipment is already finalized' }, { status: 400 })
    }

    // STEP 2: Convert shipment to ShipmentFormData format for validation
    const formData: ShipmentFormData = {
      senderName: shipment.from.name,
      senderPhone: shipment.from.phone,
      senderCountry: shipment.from.country,
      senderCity: shipment.from.city,
      senderStreet: shipment.from.street,
      senderPostalCode: shipment.from.postalCode,
      receiverName: shipment.to.name,
      receiverPhone: shipment.to.phone,
      receiverCountry: shipment.to.country,
      receiverCity: shipment.to.city,
      receiverStreet: shipment.to.street,
      receiverPostalCode: shipment.to.postalCode,
      weight: shipment.package.weight,
      length: shipment.package.length,
      width: shipment.package.width,
      height: shipment.package.height,
      itemDescription: shipment.package.description || '',
      serviceType: shipment.service.type,
      pickupMethod: shipment.service.pickupMethod,
      shipmentType: shipment.service.shipmentType,
      signatureRequired: shipment.options.signature,
      containsLiquid: shipment.options.liquid,
      insurance: shipment.options.insurance,
      packaging: shipment.options.packaging,
    }

    // STEP 3: Full validation (enforce all business rules)
    const validation = validateCompleteShipment(formData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          validationErrors: validation.errors,
          message: 'This draft cannot be finalized because it contains data errors',
        },
        { status: 400 }
      )
    }

    // STEP 4: Recalculate rates server-side
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

    // STEP 5: Update shipment with correct server-calculated rates
    const rateData = {
      base: rateCalculation.breakdown.baseCost,
      insurance: rateCalculation.breakdown.insuranceCost,
      signature: rateCalculation.breakdown.signatureCost,
      packaging: rateCalculation.breakdown.packagingCost,
      total: rateCalculation.totalPrice,
    }

    // Update the shipment with recalculated rates before finalizing
    await shipmentRepository.update(id, user!.id, formData, rateData)

    // STEP 6: Finalize the shipment
    const finalizedShipment = await shipmentRepository.finalize(id, user!.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Shipment finalized successfully',
        shipment: finalizedShipment,
        rateBreakdown: rateCalculation.breakdown,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Shipment finalization error:', error)
    return NextResponse.json(
      {
        error: 'Failed to finalize shipment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
