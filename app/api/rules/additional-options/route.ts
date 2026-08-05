import { NextRequest, NextResponse } from 'next/server'
import additionalOptionsRules from '@/lib/rules/additional-options.json'

/**
 * POST /api/rules/additional-options
 * Returns the rules for the additional options
 *
 * Request body:
 * - from: { country: string }
 * - to: { country: string }
 * - package: { weight: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, package: pkg } = body
    const senderCountry = from?.country
    const receiverCountry = to?.country
    const weight = pkg?.weight ? parseFloat(pkg.weight) : 0

    // Load the additional options rules
    const rules = JSON.parse(JSON.stringify(additionalOptionsRules))

    // Rule 1: Signature is required when sending to Jordan or Egypt
    const isReceiverJordanOrEgypt = receiverCountry === 'Jordan' || receiverCountry === 'Egypt'
    if (rules.fields.signatureRequired) {
      rules.fields.signatureRequired.checked = isReceiverJordanOrEgypt
      rules.fields.signatureRequired.disabled = isReceiverJordanOrEgypt
    }

    // Rule 2: Pickup method restrictions based on weight
    // If weight > 17kg, only drop-off is allowed UNLESS sending from Iraq
    const isSenderIraq = senderCountry === 'Iraq'
    const isHeavyPackage = weight > 17

    if (rules.fields.pickupMethod) {
      // If heavy package and NOT from Iraq, force drop-off
      if (isHeavyPackage && !isSenderIraq) {
        rules.fields.pickupMethod.allowedValues = ['postal_office']
        rules.fields.pickupMethod.defaultValue = 'postal_office'
        rules.fields.pickupMethod.disabledValues = ['home']
      } else {
        // Otherwise, allow both options
        rules.fields.pickupMethod.allowedValues = ['home', 'postal_office']
        rules.fields.pickupMethod.defaultValue = 'home'
        rules.fields.pickupMethod.disabledValues = []
      }
    }

    return NextResponse.json({
      cardName: rules.cardName,
      title: rules.title,
      enabled: true,
      fields: rules.fields,
      context: {
        senderCountry,
        receiverCountry,
        weight,
      },
    })
  } catch (error) {
    console.error('Error loading additional options rules:', error)
    return NextResponse.json(
      { error: 'Failed to load additional options' },
      { status: 500 }
    )
  }
}
