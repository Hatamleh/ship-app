import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createAuthCookie } from '@/lib/auth'
import { userRepository } from '@/repositories'

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Find user by email (with password for verification)
    const user = await userRepository.findByEmailWithPassword(email.toLowerCase())

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create auth cookie with JWT
    const cookie = createAuthCookie(user.id, user.email)

    // Return success with user data (without password)
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(
      {
        message: 'Logged in successfully',
        user: userWithoutPassword,
      },
      { status: 200 }
    )

    response.headers.set('Set-Cookie', cookie)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
