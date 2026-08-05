import { NextRequest, NextResponse } from 'next/server'
import packageCardRules from '@/lib/rules/package-card.json'
import { determineShipmentType, isGulfCountry } from '@/lib/validators/shipment-validator'

/**
 * POST /api/rules/package
 * Returns the rules for the package card
 *
 * Request body:
 * - from: { country: string }
 * - to: { country: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to } = body
    const senderCountry = from?.country
    const receiverCountry = to?.country

    // Validate required parameters
    if (!senderCountry || !receiverCountry) {
      return NextResponse.json(
        { error: 'Sender and receiver countries are required' },
        { status: 400 }
      )
    }

    // Determine shipment type
    const shipmentType = determineShipmentType(senderCountry, receiverCountry)

    // Get the rules for this shipment type
    const typeRules = packageCardRules.shipmentTypes[shipmentType]

    if (!typeRules) {
      return NextResponse.json(
        { error: 'Invalid shipment type' },
        { status: 400 }
      )
    }

    // Load the base package card rules
    const rules = JSON.parse(JSON.stringify(packageCardRules))

    // Update weight validation with the max weight for this shipment type
    if (rules.fields.weight?.validation) {
      rules.fields.weight.validation.max = typeRules.maxWeight
      rules.fields.weight.validation.errorMessage = `Weight must be between 0.1 and ${typeRules.maxWeight} kg`
    }

    // Check if sender is non-Gulf and receiver is Gulf
    const isSenderGulf = isGulfCountry(senderCountry)
    const isReceiverGulf = isGulfCountry(receiverCountry)
    const isNonGulfToGulf = !isSenderGulf && isReceiverGulf

    // Rule: Item description is required when shipping from non-Gulf to Gulf countries
    if (rules.fields.itemDescription) {
      rules.fields.itemDescription.required = isNonGulfToGulf
      rules.fields.itemDescription.visible = isNonGulfToGulf
      if (rules.fields.itemDescription.validation) {
        rules.fields.itemDescription.validation.required = isNonGulfToGulf
      }
    }

    return NextResponse.json({
      cardName: rules.cardName,
      title: rules.title,
      enabled: true,
      fields: rules.fields,
      shipmentType,
      maxWeight: typeRules.maxWeight,
      maxDimension: typeRules.maxDimension,
      context: {
        senderCountry,
        receiverCountry,
      },
    })
  } catch (error) {
    console.error('Error loading package rules:', error)
    return NextResponse.json(
      { error: 'Failed to load package rules' },
      { status: 500 }
    )
  }
}
