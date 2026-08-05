import { t as countries_default } from "../../../../../chunks/countries.js";
import { n as isGulfCountry } from "../../../../../chunks/shipment-validator.js";
import { t as sender_card_default } from "../../../../../chunks/sender-card.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/rules/sender/+server.ts
/**
* POST /api/rules/sender
* Returns the rules for the sender card
*
* Request body:
* - from: { country: string }
*/
var POST = async ({ request }) => {
	try {
		const { from } = await request.json();
		const senderCountry = from?.country;
		const rules = JSON.parse(JSON.stringify(sender_card_default));
		rules.fields.senderCountry.options = countries_default.countries.map((country) => ({
			value: country.name,
			label: country.name
		}));
		const senderIsGulf = senderCountry ? isGulfCountry(senderCountry) : false;
		if (rules.fields.senderStreet) {
			rules.fields.senderStreet.required = senderIsGulf;
			if (rules.fields.senderStreet.validation) rules.fields.senderStreet.validation.required = senderIsGulf;
		}
		return json(rules);
	} catch (err) {
		console.error("Error loading sender rules:", err);
		return json({ error: "Failed to load sender rules" }, { status: 500 });
	}
};
//#endregion
export { POST };
