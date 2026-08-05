import { error } from "@sveltejs/kit";
//#region src/lib/server/guard.ts
/**
* Returns the signed-in user or throws a 401.
*
* Uses SvelteKit's `error()`, so a route handler can simply write
* `const user = requireUser(event)` with no early-return plumbing.
*/
function requireUser(event) {
	if (!event.locals.user) error(401, "Unauthorized");
	return event.locals.user;
}
//#endregion
export { requireUser as t };
