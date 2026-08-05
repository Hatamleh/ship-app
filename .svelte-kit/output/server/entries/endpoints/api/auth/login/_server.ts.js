import { n as userRepository } from "../../../../../chunks/repositories.js";
import { a as verifyPassword, i as setAuthCookie } from "../../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/login/+server.ts
/**
* POST /api/auth/login
* Authenticate user with email and password
*/
var POST = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();
		if (!email || !password) return json({ error: "Email and password are required" }, { status: 400 });
		const user = await userRepository.findByEmailWithPassword(email.toLowerCase());
		if (!user) return json({ error: "Invalid email or password" }, { status: 401 });
		if (!await verifyPassword(password, user.password)) return json({ error: "Invalid email or password" }, { status: 401 });
		setAuthCookie(cookies, user.id, user.email);
		const { password: _, ...userWithoutPassword } = user;
		return json({
			message: "Logged in successfully",
			user: userWithoutPassword
		});
	} catch (err) {
		console.error("Login error:", err);
		return json({ error: "Login failed" }, { status: 500 });
	}
};
//#endregion
export { POST };
