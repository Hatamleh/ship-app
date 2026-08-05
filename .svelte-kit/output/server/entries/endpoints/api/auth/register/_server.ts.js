import { n as userRepository } from "../../../../../chunks/repositories.js";
import { i as setAuthCookie, r as hashPassword } from "../../../../../chunks/auth.js";
import { t as sender_card_default } from "../../../../../chunks/sender-card.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/register/+server.ts
/**
* POST /api/auth/register
* Register a new user with personal information
*/
var POST = async ({ request, cookies }) => {
	try {
		const { email, password, fullName, phone, country, city, street, postalCode } = await request.json();
		if (!email || !password || !fullName || !phone || !country || !city || !street || !postalCode) return json({ error: "All fields are required" }, { status: 400 });
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email format" }, { status: 400 });
		if (password.length < 6) return json({ error: "Password must be at least 6 characters" }, { status: 400 });
		const formData = {
			senderName: fullName,
			senderPhone: phone,
			senderCountry: country,
			senderCity: city,
			senderStreet: street,
			senderPostalCode: postalCode
		};
		const validationErrors = [];
		for (const [fieldName, fieldRule] of Object.entries(sender_card_default.fields)) {
			const value = formData[fieldName];
			const validation = fieldRule.validation;
			const label = fieldRule.label;
			if (validation?.required && (!value || value.trim() === "")) {
				validationErrors.push(validation.errorMessage || `${label} is required`);
				continue;
			}
			if (value && validation?.minLength && value.length < validation.minLength) validationErrors.push(validation.errorMessage || `${label} must be at least ${validation.minLength} characters`);
			if (value && validation?.maxLength && value.length > validation.maxLength) validationErrors.push(`${label} must be at most ${validation.maxLength} characters`);
		}
		if (validationErrors.length > 0) return json({ error: validationErrors[0] }, { status: 400 });
		if (await userRepository.findByEmail(email.toLowerCase())) return json({ error: "Email is already registered" }, { status: 409 });
		const user = await userRepository.create({
			email: email.toLowerCase(),
			password: await hashPassword(password),
			fullName,
			phone,
			country,
			city,
			street,
			postalCode
		});
		setAuthCookie(cookies, user.id, user.email);
		return json({
			message: "Registered successfully",
			user
		}, { status: 201 });
	} catch (err) {
		console.error("Registration error:", err);
		return json({ error: "Failed to register user" }, { status: 500 });
	}
};
//#endregion
export { POST };
