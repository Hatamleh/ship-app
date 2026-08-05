import { t as private_env } from "./shared-server.js";
import { t as prisma } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//#region src/lib/server/auth.ts
var AUTH_COOKIE_NAME = "auth_session";
var SALT_ROUNDS = 10;
var JWT_EXPIRES_IN = "30d";
var MAX_AGE_SECONDS = 2592e3;
function jwtSecret() {
	return private_env.JWT_SECRET || "fallback-secret-change-in-production";
}
/**
* Hashes a password using bcrypt
*/
async function hashPassword(password) {
	return bcrypt.hash(password, SALT_ROUNDS);
}
/**
* Compares a password with its hash
*/
async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}
function createJWT(userId, email) {
	return jwt.sign({
		userId,
		email
	}, jwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}
function verifyJWT(token) {
	try {
		return jwt.verify(token, jwtSecret());
	} catch {
		return null;
	}
}
/**
* Sets the authentication cookie.
*
* SvelteKit manages Set-Cookie for us via event.cookies, so unlike the previous
* implementation there is no manual header serialisation.
*/
function setAuthCookie(cookies, userId, email) {
	cookies.set(AUTH_COOKIE_NAME, createJWT(userId, email), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: MAX_AGE_SECONDS,
		path: "/"
	});
}
/**
* Clears the authentication cookie.
*/
function clearAuthCookie(cookies) {
	cookies.delete(AUTH_COOKIE_NAME, { path: "/" });
}
/**
* Resolves the signed-in user from the auth cookie.
*
* Called once per request by the handle hook in src/hooks.server.ts, which puts
* the result on event.locals.user. Route handlers read locals rather than
* repeating an auth check.
*/
async function getUserFromCookies(cookies) {
	const token = cookies.get(AUTH_COOKIE_NAME);
	if (!token) return null;
	const payload = verifyJWT(token);
	if (!payload) return null;
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
			updatedAt: true
		}
	});
}
//#endregion
export { verifyPassword as a, setAuthCookie as i, getUserFromCookies as n, hashPassword as r, clearAuthCookie as t };
