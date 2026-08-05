import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import receiverCardRules from '$lib/rules/receiver-card.json'
import countriesData from '$lib/rules/countries.json'
import { isGulfCountry } from '$lib/server/validators/shipment-validator'

/**
 * POST /api/rules/receiver
 * Returns the rules for the receiver card
 *
 * Request body:
 * - from: { country: string }
 * - to:   { country: string }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { from, to } = await request.json()
    const senderCountry = from?.country
    const receiverCountry = to?.country

    const rules = JSON.parse(JSON.stringify(receiverCardRules))

    rules.fields.receiverCountry.options = countriesData.countries.map((country) => ({
      value: country.name,
      label: country.name,
    }))

    // Rule: street address is required for Gulf countries, optional otherwise
    const receiverIsGulf = receiverCountry ? isGulfCountry(receiverCountry) : false
    if (rules.fields.receiverStreet) {
      rules.fields.receiverStreet.required = receiverIsGulf
      if (rules.fields.receiverStreet.validation) {
        rules.fields.receiverStreet.validation.required = receiverIsGulf
      }
    }

    // Rule: cannot ship from Gulf countries to Iraq
    const validationErrors: Record<string, string> = {}
    const senderIsGulf = senderCountry ? isGulfCountry(senderCountry) : false
    if (senderIsGulf && receiverCountry === 'Iraq') {
      validationErrors.receiverCountry =
        'Shipping from Gulf countries to Iraq is not currently available'
    }

    return json({
      ...rules,
      enabled: true,
      validationErrors,
      context: { senderCountry, receiverCountry },
    })
  } catch (err) {
    console.error('Error loading receiver rules:', err)
    return json({ error: 'Failed to load receiver rules' }, { status: 500 })
  }
}
