import { error } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import type { User } from '$lib/types'

/**
 * Returns the signed-in user or throws a 401.
 *
 * Uses SvelteKit's `error()`, so a route handler can simply write
 * `const user = requireUser(event)` with no early-return plumbing.
 */
export function requireUser(event: RequestEvent): User {
  if (!event.locals.user) {
    error(401, 'Unauthorized')
  }
  return event.locals.user
}
