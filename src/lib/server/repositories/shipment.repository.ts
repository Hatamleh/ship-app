import { prisma } from '$lib/server/db'
import type { Shipment, ShipmentFilters, ShipmentFormData } from '$lib/types'

/**
 * Shipment Repository
 * Handles all database operations for Shipment model
 * Transforms flat DB structure to structured Shipment type (from/to/package/service/options/rate)
 */
export class ShipmentRepository {
  /**
   * Find shipment by ID (must belong to user)
   */
  async findById(id: number, userId: number): Promise<Shipment | null> {
    const shipment = await prisma.shipment.findFirst({
      where: { id, userId },
    })
    return shipment ? this.transform(shipment) : null
  }

  /**
   * Find all shipments for a user with filters
   */
  async findByUserId(
    userId: number,
    filters?: ShipmentFilters
  ): Promise<{ shipments: Shipment[]; total: number }> {
    const where: any = { userId }

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status
    }

    if (filters?.shipmentType && filters.shipmentType !== 'all') {
      where.shipmentType = filters.shipmentType
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        orderBy: {
          [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
        },
        skip: filters?.page ? (filters.page - 1) * (filters.limit || 10) : 0,
        take: filters?.limit || 10,
      }),
      prisma.shipment.count({ where }),
    ])

    return {
      shipments: shipments.map((s) => this.transform(s)),
      total,
    }
  }

  /**
   * Create new shipment
   */
  async create(
    userId: number,
    data: ShipmentFormData,
    rates: { base: number; total: number; [key: string]: number }
  ): Promise<Shipment> {
    const shipment = await prisma.shipment.create({
      data: {
        userId,
        trackingNumber: this.generateTrackingNumber(),
        // From (Sender)
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        senderCountry: data.senderCountry,
        senderCity: data.senderCity,
        senderStreet: data.senderStreet,
        senderPostalCode: data.senderPostalCode,
        // To (Receiver)
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverCountry: data.receiverCountry,
        receiverCity: data.receiverCity,
        receiverStreet: data.receiverStreet,
        receiverPostalCode: data.receiverPostalCode,
        // Package
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
        contentDescription: data.itemDescription || '',
        // Service
        shipmentType: data.shipmentType || 'Domestic',
        serviceType: data.serviceType,
        pickupMethod: data.pickupMethod,
        // Options
        signatureRequired: data.signatureRequired,
        containsLiquid: data.containsLiquid,
        insurance: data.insurance,
        packaging: data.packaging,
        // Rate
        price: rates.total || 0,
        baseCost: rates.base || 0,
        insuranceCost: rates.insurance || 0,
        signatureCost: rates.signature || 0,
        packagingCost: rates.packaging || 0,
        totalCost: rates.total || 0,
        // Status
        status: 'draft',
        isDraft: true,
      },
    })

    return this.transform(shipment)
  }

  /**
   * Update existing shipment
   */
  async update(
    id: number,
    userId: number,
    data: ShipmentFormData,
    rates: { base: number; total: number; [key: string]: number }
  ): Promise<Shipment> {
    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        // From (Sender)
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        senderCountry: data.senderCountry,
        senderCity: data.senderCity,
        senderStreet: data.senderStreet,
        senderPostalCode: data.senderPostalCode,
        // To (Receiver)
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverCountry: data.receiverCountry,
        receiverCity: data.receiverCity,
        receiverStreet: data.receiverStreet,
        receiverPostalCode: data.receiverPostalCode,
        // Package
        weight: typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight,
        length: typeof data.length === 'string' ? parseFloat(data.length) : data.length,
        width: typeof data.width === 'string' ? parseFloat(data.width) : data.width,
        height: typeof data.height === 'string' ? parseFloat(data.height) : data.height,
        contentDescription: data.itemDescription || '',
        // Service
        shipmentType: data.shipmentType || 'Domestic',
        serviceType: data.serviceType,
        pickupMethod: data.pickupMethod,
        // Options
        signatureRequired: data.signatureRequired,
        containsLiquid: data.containsLiquid,
        insurance: data.insurance,
        packaging: data.packaging,
        // Rate
        price: rates.total || 0,
        baseCost: rates.base || 0,
        insuranceCost: rates.insurance || 0,
        signatureCost: rates.signature || 0,
        packagingCost: rates.packaging || 0,
        totalCost: rates.total || 0,
      },
    })

    return this.transform(shipment)
  }

  /**
   * Delete shipment
   */
  async delete(id: number, userId: number): Promise<void> {
    await prisma.shipment.delete({
      where: { id, userId },
    })
  }

  /**
   * Finalize shipment (change status from draft to finalized)
   */
  async finalize(id: number, userId: number): Promise<Shipment> {
    const shipment = await prisma.shipment.update({
      where: { id, userId },
      data: {
        status: 'finalized',
        isDraft: false,
      },
    })
    return this.transform(shipment)
  }

  /**
   * Transform flat Prisma Shipment to structured Shipment type
   * Converts: flat DB structure → from/to/package/service/options/rate structure
   */
  private transform(db: any): Shipment {
    return {
      id: db.id,
      trackingNumber: db.trackingNumber,
      status: db.status,
      from: {
        name: db.senderName,
        phone: db.senderPhone,
        country: db.senderCountry,
        city: db.senderCity,
        street: db.senderStreet,
        postalCode: db.senderPostalCode,
      },
      to: {
        name: db.receiverName,
        phone: db.receiverPhone,
        country: db.receiverCountry,
        city: db.receiverCity,
        street: db.receiverStreet,
        postalCode: db.receiverPostalCode,
      },
      package: {
        weight: db.weight,
        length: db.length,
        width: db.width,
        height: db.height,
        description: db.contentDescription,
      },
      service: {
        type: db.serviceType,
        shipmentType: db.shipmentType,
        pickupMethod: db.pickupMethod,
      },
      options: {
        signature: db.signatureRequired,
        liquid: db.containsLiquid,
        insurance: db.insurance,
        packaging: db.packaging,
      },
      rate: {
        base: db.baseCost,
        total: db.totalCost,
        signature: db.signatureCost,
        insurance: db.insuranceCost,
        packaging: db.packagingCost,
        liquid: 0, // Liquid fee is included in total
      },
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
    }
  }

  /**
   * Generate unique tracking number
   * Format: TR + 9 random digits
   */
  private generateTrackingNumber(): string {
    return 'TR' + Math.random().toString().slice(2, 11)
  }
}

// Export singleton instance
export const shipmentRepository = new ShipmentRepository()
