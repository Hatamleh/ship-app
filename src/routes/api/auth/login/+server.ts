import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { verifyPassword, setAuthCookie } from '$lib/server/auth'
import { userRepository } from '$lib/server/repositories'

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await userRepository.findByEmailWithPassword(email.toLowerCase())

    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return json({ error: 'Invalid email or password' }, { status: 401 })
    }

    setAuthCookie(cookies, user.id, user.email)

    const { password: _, ...userWithoutPassword } = user

    return json({ message: 'Logged in successfully', user: userWithoutPassword })
  } catch (err) {
    console.error('Login error:', err)
    return json({ error: 'Login failed' }, { status: 500 })
  }
}
