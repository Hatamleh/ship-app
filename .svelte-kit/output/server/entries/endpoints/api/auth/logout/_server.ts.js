import { t as clearAuthCookie } from "../../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/logout/+server.ts
/**
* POST /api/auth/logout
* Logout user by clearing the authentication cookie
*/
var POST = async ({ cookies }) => {
	clearAuthCookie(cookies);
	return json({ message: "Logged out successfully" });
};
//#endregion
export { POST };
