import type { APIRequestContext, APIResponse } from '@playwright/test'

export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Static API client for /api/auth/*. Pass `page.request` so the session cookie
 * set by the login response is stored in the browser context and the page is
 * logged in without going through the UI.
 */
export class AuthClient {
  static async login(
    request: APIRequestContext,
    credentials: LoginCredentials,
  ): Promise<APIResponse> {
    return request.post('/api/auth/login', { data: credentials })
  }
}
