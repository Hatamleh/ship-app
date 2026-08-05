import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { clearAuthCookie } from '$lib/server/auth'

/**
 * POST /api/auth/logout
 * Logout user by clearing the authentication cookie
 */
export const POST: RequestHandler = async ({ cookies }) => {
  clearAuthCookie(cookies)
  return json({ message: 'Logged out successfully' })
}
