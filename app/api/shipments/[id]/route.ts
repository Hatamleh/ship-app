import { NextRequest, NextResponse } from 'next/server'
import { shipmentRepository } from '@/repositories'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/shipments/[id]
 * Retrieve a single shipment by ID
 */
export async function GET(
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

    // Use repository to fetch shipment
    const shipment = await shipmentRepository.findById(id, user!.id)

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    return NextResponse.json({ shipment })
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Failed to load shipment' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/shipments/[id]
 * Update a shipment (for editing draft shipments)
 */
export async function PUT(
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

    const body = await request.json()
    const { from, to, package: pkg, service, additional, rates } = body

    // Check if shipment exists and belongs to user
    const existingShipment = await shipmentRepository.findById(id, user!.id)

    if (!existingShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Only allow updating draft shipments
    if (existingShipment.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only drafts can be edited' },
        { status: 400 }
      )
    }

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

    // Extract rates
    const rateData = {
      base: Number(rates?.base) || 0,
      insurance: Number(rates?.insurance) || 0,
      signature: Number(rates?.signature) || 0,
      packaging: Number(rates?.packaging) || 0,
      total: Number(rates?.total) || 0,
    }

    // Update shipment using repository
    const shipment = await shipmentRepository.update(id, user!.id, formData, rateData)

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error updating shipment:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update shipment', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update shipment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/shipments/[id]
 * Delete a shipment (cancel an order)
 */
export async function DELETE(
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

    // Check if shipment exists and belongs to user
    const existingShipment = await shipmentRepository.findById(id, user!.id)

    if (!existingShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Delete shipment using repository
    await shipmentRepository.delete(id, user!.id)

    return NextResponse.json({
      success: true,
      message: existingShipment.status === 'draft'
        ? 'Shipment deleted successfully'
        : 'Shipment cancelled successfully',
    })
  } catch (error) {
    console.error('Error deleting shipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipment' },
      { status: 500 }
    )
  }
}
