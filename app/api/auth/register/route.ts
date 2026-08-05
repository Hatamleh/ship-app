import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, createAuthCookie } from '@/lib/auth'
import { userRepository } from '@/repositories'

/**
 * POST /api/auth/register
 * Register a new user with personal information
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, phone, country, city, street, postalCode } = body

    // Validate required fields
    if (!email || !password || !fullName || !phone || !country || !city || !street || !postalCode) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Validate personal info using sender card rules
    const senderRulesModule = await import('@/lib/rules/sender-card.json')
    const senderRules = senderRulesModule.default

    const formData = {
      senderName: fullName,
      senderPhone: phone,
      senderCountry: country,
      senderCity: city,
      senderStreet: street,
      senderPostalCode: postalCode,
    }

    // Validate each field against sender card rules
    const validationErrors: string[] = []

    for (const [fieldName, fieldRule] of Object.entries(senderRules.fields)) {
      const value = formData[fieldName as keyof typeof formData]
      const validation = fieldRule.validation as any

      if (validation?.required && (!value || value.trim() === '')) {
        validationErrors.push(validation.errorMessage || `${fieldRule.label} Required`)
        continue
      }

      if (value && validation?.minLength && value.length < validation.minLength) {
        validationErrors.push(validation.errorMessage || `${fieldRule.label} must be at least ${validation.minLength} characters`)
      }

      if (value && validation?.maxLength && value.length > validation.maxLength) {
        validationErrors.push(`${fieldRule.label} must be at most ${validation.maxLength} characters`)
      }

      if (value && validation?.pattern) {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(value)) {
          validationErrors.push(validation.errorMessage || `${fieldRule.label} is invalid`)
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors[0] }, // Return first error
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email.toLowerCase())

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phone,
      country,
      city,
      street,
      postalCode,
    }

    const user = await userRepository.create(userData)

    // Create auth cookie with JWT
    const cookie = createAuthCookie(user.id, user.email)

    // Return success with user data
    const response = NextResponse.json(
      {
        message: 'Registered successfully',
        user,
      },
      { status: 201 }
    )

    response.headers.set('Set-Cookie', cookie)

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
  }
}
