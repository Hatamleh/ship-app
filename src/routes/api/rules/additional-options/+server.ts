import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import additionalOptionsRules from '$lib/rules/additional-options.json'

/**
 * POST /api/rules/additional-options
 * Returns the rules for the additional options card
 *
 * Request body:
 * - from: { country: string }
 * - to:   { country: string }
 * - package: { weight: number }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { from, to, package: pkg } = await request.json()
    const senderCountry = from?.country
    const receiverCountry = to?.country
    const weight = pkg?.weight ? parseFloat(pkg.weight) : 0

    const rules = JSON.parse(JSON.stringify(additionalOptionsRules))

    // Rule: signature is mandatory when shipping to Jordan or Egypt
    const signatureMandatory = receiverCountry === 'Jordan' || receiverCountry === 'Egypt'
    if (rules.fields.signatureRequired) {
      rules.fields.signatureRequired.checked = signatureMandatory
      rules.fields.signatureRequired.disabled = signatureMandatory
    }

    // Rule: home pickup is unavailable above 17 kg, unless the sender is in Iraq
    const isSenderIraq = senderCountry === 'Iraq'
    const isHeavyPackage = weight > 17

    if (rules.fields.pickupMethod) {
      if (isHeavyPackage && !isSenderIraq) {
        rules.fields.pickupMethod.allowedValues = ['postal_office']
        rules.fields.pickupMethod.defaultValue = 'postal_office'
        rules.fields.pickupMethod.disabledValues = ['home']
      } else {
        rules.fields.pickupMethod.allowedValues = ['home', 'postal_office']
        rules.fields.pickupMethod.defaultValue = 'home'
        rules.fields.pickupMethod.disabledValues = []
      }
    }

    return json({
      cardName: rules.cardName,
      title: rules.title,
      enabled: true,
      fields: rules.fields,
      context: { senderCountry, receiverCountry, weight },
    })
  } catch (err) {
    console.error('Error loading additional options rules:', err)
    return json({ error: 'Failed to load additional options' }, { status: 500 })
  }
}
