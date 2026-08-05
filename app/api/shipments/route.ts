import { NextRequest, NextResponse } from 'next/server'
import { shipmentRepository } from '@/repositories'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/shipments
 * Retrieve all shipments with optional filtering, sorting, and pagination
 *
 * Query parameters:
 * - status: Filter by status (draft, finalized, or all)
 * - shipmentType: Filter by shipment type (Domestic, IntraGulf, International, or all)
 * - sortBy: Sort by field (createdAt, totalCost, status)
 * - sortOrder: Sort order (asc, desc)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const { user, response } = await requireAuth(request)
    if (response) return response

    const searchParams = request.nextUrl.searchParams

    // Build filters
    const filters = {
      status: searchParams.get('status') || undefined,
      shipmentType: searchParams.get('shipmentType') || undefined,
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'totalCost' | 'status',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    }

    // Use repository to fetch shipments
    const { shipments, total } = await shipmentRepository.findByUserId(user!.id, filters as any)

    return NextResponse.json({
      shipments,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Failed to load shipments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/shipments
 * Create a new draft shipment
 *
 * Request body should include ShipmentFormData:
 * - senderName, senderPhone, senderCountry, senderCity, senderStreet, senderPostalCode
 * - receiverName, receiverPhone, receiverCountry, receiverCity, receiverStreet, receiverPostalCode
 * - weight, length, width, height, itemDescription
 * - serviceType, shipmentType, pickupMethod
 * - signatureRequired, containsLiquid, insurance, packaging
 * - Rates: baseCost, insuranceCost, signatureCost, packagingCost, totalCost
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { user, response } = await requireAuth(request)
    if (response) return response

    const body = await request.json()

    // Extract rates
    const rates = {
      base: Number(body.baseCost) || 0,
      insurance: Number(body.insuranceCost) || 0,
      signature: Number(body.signatureCost) || 0,
      packaging: Number(body.packagingCost) || 0,
      total: Number(body.totalCost) || 0,
    }

    // Create shipment using repository
    const shipment = await shipmentRepository.create(user!.id, body, rates)

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to create shipment', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    )
  }
}
