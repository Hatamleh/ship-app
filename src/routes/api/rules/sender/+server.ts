import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import senderCardRules from '$lib/rules/sender-card.json'
import countriesData from '$lib/rules/countries.json'
import { isGulfCountry } from '$lib/server/validators/shipment-validator'

/**
 * POST /api/rules/sender
 * Returns the rules for the sender card
 *
 * Request body:
 * - from: { country: string }
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { from } = await request.json()
    const senderCountry = from?.country

    const rules = JSON.parse(JSON.stringify(senderCardRules))

    rules.fields.senderCountry.options = countriesData.countries.map((country) => ({
      value: country.name,
      label: country.name,
    }))

    // Rule: street address is required for Gulf countries, optional otherwise
    const senderIsGulf = senderCountry ? isGulfCountry(senderCountry) : false
    if (rules.fields.senderStreet) {
      rules.fields.senderStreet.required = senderIsGulf
      if (rules.fields.senderStreet.validation) {
        rules.fields.senderStreet.validation.required = senderIsGulf
      }
    }

    return json(rules)
  } catch (err) {
    console.error('Error loading sender rules:', err)
    return json({ error: 'Failed to load sender rules' }, { status: 500 })
  }
}
