import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { hashPassword, setAuthCookie } from '$lib/server/auth'
import { userRepository } from '$lib/server/repositories'
import senderRules from '$lib/rules/sender-card.json'

/**
 * POST /api/auth/register
 * Register a new user with personal information
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, country, city, street, postalCode } = body

    if (!email || !password || !fullName || !phone || !country || !city || !street || !postalCode) {
      return json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Validate the personal details against the same rules the sender card uses,
    // so registration and the shipment form cannot drift apart.
    const formData: Record<string, string> = {
      senderName: fullName,
      senderPhone: phone,
      senderCountry: country,
      senderCity: city,
      senderStreet: street,
      senderPostalCode: postalCode,
    }

    const validationErrors: string[] = []

    for (const [fieldName, fieldRule] of Object.entries(senderRules.fields)) {
      const value = formData[fieldName]
      const validation = (fieldRule as any).validation
      const label = (fieldRule as any).label

      if (validation?.required && (!value || value.trim() === '')) {
        validationErrors.push(validation.errorMessage || `${label} is required`)
        continue
      }

      if (value && validation?.minLength && value.length < validation.minLength) {
        validationErrors.push(
          validation.errorMessage || `${label} must be at least ${validation.minLength} characters`
        )
      }

      if (value && validation?.maxLength && value.length > validation.maxLength) {
        validationErrors.push(`${label} must be at most ${validation.maxLength} characters`)
      }
    }

    if (validationErrors.length > 0) {
      return json({ error: validationErrors[0] }, { status: 400 })
    }

    const existingUser = await userRepository.findByEmail(email.toLowerCase())
    if (existingUser) {
      return json({ error: 'Email is already registered' }, { status: 409 })
    }

    const user = await userRepository.create({
      email: email.toLowerCase(),
      password: await hashPassword(password),
      fullName,
      phone,
      country,
      city,
      street,
      postalCode,
    })

    setAuthCookie(cookies, user.id, user.email)

    return json({ message: 'Registered successfully', user }, { status: 201 })
  } catch (err) {
    console.error('Registration error:', err)
    return json({ error: 'Failed to register user' }, { status: 500 })
  }
}
