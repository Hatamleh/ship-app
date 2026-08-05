import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/me/+server.ts
/**
* GET /api/auth/me
* Get the current authenticated user.
* locals.user is populated by the handle hook in src/hooks.server.ts.
*/
var GET = async ({ locals }) => {
	if (!locals.user) return json({ error: "Unauthorized" }, { status: 401 });
	return json({ user: locals.user });
};
//#endregion
export { GET };
