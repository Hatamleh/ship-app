import type { Handle } from '@sveltejs/kit'
import { getUserFromCookies } from '$lib/server/auth'

/**
 * Resolves the signed-in user once per request and puts it on event.locals.
 *
 * This replaces the requireAuth() call that every Next route handler had to make
 * for itself — route handlers now just read locals.user.
 */
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = await getUserFromCookies(event.cookies)
  return resolve(event)
}
