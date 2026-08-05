import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Cookies } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { prisma } from './db'

export const AUTH_COOKIE_NAME = 'auth_session'
const SALT_ROUNDS = 10
const JWT_EXPIRES_IN = '30d' // 30 days
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function jwtSecret(): string {
  return env.JWT_SECRET || 'fallback-secret-change-in-production'
}

interface JWTPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compares a password with its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function createJWT(userId: number, email: string): string {
  return jwt.sign({ userId, email } as JWTPayload, jwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  })
}

function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, jwtSecret()) as JWTPayload
  } catch {
    // Token is invalid or expired
    return null
  }
}

/**
 * Sets the authentication cookie.
 *
 * SvelteKit manages Set-Cookie for us via event.cookies, so unlike the previous
 * implementation there is no manual header serialisation.
 */
export function setAuthCookie(cookies: Cookies, userId: number, email: string): void {
  cookies.set(AUTH_COOKIE_NAME, createJWT(userId, email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  })
}

/**
 * Clears the authentication cookie.
 */
export function clearAuthCookie(cookies: Cookies): void {
  cookies.delete(AUTH_COOKIE_NAME, { path: '/' })
}

/**
 * Resolves the signed-in user from the auth cookie.
 *
 * Called once per request by the handle hook in src/hooks.server.ts, which puts
 * the result on event.locals.user. Route handlers read locals rather than
 * repeating an auth check.
 */
export async function getUserFromCookies(cookies: Cookies) {
  const token = cookies.get(AUTH_COOKIE_NAME)
  if (!token) return null

  const payload = verifyJWT(token)
  if (!payload) return null

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      country: true,
      city: true,
      street: true,
      postalCode: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}
