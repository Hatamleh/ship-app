import { n as getUserFromCookies } from "../chunks/auth.js";
//#region src/hooks.server.ts
/**
* Resolves the signed-in user once per request and puts it on event.locals.
*
* This replaces the requireAuth() call that every Next route handler had to make
* for itself — route handlers now just read locals.user.
*/
var handle = async ({ event, resolve }) => {
	event.locals.user = await getUserFromCookies(event.cookies);
	return resolve(event);
};
//#endregion
export { handle };
