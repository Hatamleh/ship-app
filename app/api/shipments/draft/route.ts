import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { shipmentRepository } from '@/repositories'
import { validateDraftShipment } from '@/lib/validators/shipment-validator'

/**
 * POST /api/shipments/draft
 * Create or update a draft shipment
 * Minimal validation - allows saving incomplete/partial shipments
 * Purpose: Save work-in-progress
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { user, response } = await requireAuth(request)
    if (response) return response

    const body = await request.json()
    const { from, to, package: pkg, service, additional, rates } = body

    // Convert structured input to ShipmentFormData
    const formData = {
      // From (Sender)
      senderName: from?.name || '',
      senderPhone: from?.phone || '',
      senderCountry: from?.country || '',
      senderCity: from?.city || '',
      senderStreet: from?.street || '',
      senderPostalCode: from?.postalCode || '',
      // To (Receiver)
      receiverName: to?.name || '',
      receiverPhone: to?.phone || '',
      receiverCountry: to?.country || '',
      receiverCity: to?.city || '',
      receiverStreet: to?.street || '',
      receiverPostalCode: to?.postalCode || '',
      // Package
      weight: Number(pkg?.weight) || 0,
      length: Number(pkg?.length) || 0,
      width: Number(pkg?.width) || 0,
      height: Number(pkg?.height) || 0,
      itemDescription: pkg?.description || '',
      // Service
      serviceType: service?.type || '',
      pickupMethod: service?.pickupMethod || 'home',
      shipmentType: service?.shipmentType || 'Domestic',
      // Options
      signatureRequired: additional?.signature || false,
      containsLiquid: additional?.liquid || false,
      insurance: additional?.insurance || false,
      packaging: additional?.packaging || false,
    }

    // Minimal validation for drafts (only type checking)
    const validation = validateDraftShipment(formData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid data format',
          validationErrors: validation.errors,
        },
        { status: 400 }
      )
    }

    // Extract rates (for drafts, we accept whatever the frontend sends)
    const rateData = {
      base: Number(rates?.base) || 0,
      insurance: Number(rates?.insurance) || 0,
      signature: Number(rates?.signature) || 0,
      packaging: Number(rates?.packaging) || 0,
      total: Number(rates?.total) || 0,
    }

    // Create draft shipment using repository
    const shipment = await shipmentRepository.create(user!.id, formData, rateData)

    return NextResponse.json(
      {
        success: true,
        message: 'Draft saved successfully',
        shipment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating draft shipment:', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}
