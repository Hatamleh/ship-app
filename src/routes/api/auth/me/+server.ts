import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * GET /api/auth/me
 * Get the current authenticated user.
 * locals.user is populated by the handle hook in src/hooks.server.ts.
 */
export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }
  return json({ user: locals.user })
}
