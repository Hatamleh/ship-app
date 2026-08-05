import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

const PUBLIC_ROUTES = ['/login', '/register']

/**
 * Resolves auth on the server before anything renders.
 *
 * The React version fetched /api/auth/me from a context provider on mount,
 * which meant a loading flash and a client-side redirect. Here the redirect
 * happens before the page is sent, and the user is available to every route
 * through `data.user`.
 */
export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isPublicRoute = PUBLIC_ROUTES.includes(url.pathname)

  if (!locals.user && !isPublicRoute) {
    redirect(303, '/login')
  }

  if (locals.user && isPublicRoute) {
    redirect(303, '/')
  }

  return { user: locals.user }
}
