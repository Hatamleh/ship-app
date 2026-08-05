import { t as countries_default } from "../../../../../chunks/countries.js";
import { n as isGulfCountry } from "../../../../../chunks/shipment-validator.js";
import { json } from "@sveltejs/kit";
var receiver_card_default = {
	cardName: "receiver",
	title: "Receiver Information",
	enabled: false,
	fields: {
		"receiverName": {
			"type": "text",
			"label": "Full Name",
			"required": true,
			"validation": {
				"required": true,
				"minLength": 2,
				"errorMessage": "Name must be at least 2 characters"
			},
			"placeholder": "Enter the receiver's full name"
		},
		"receiverPhone": {
			"type": "text",
			"label": "Phone Number",
			"required": true,
			"validation": {
				"required": true,
				"minLength": 10,
				"maxLength": 15,
				"errorMessage": "Phone number must be between 10-15 digits"
			},
			"placeholder": "e.g. 0501234567"
		},
		"receiverCountry": {
			"type": "select",
			"label": "Country",
			"required": true,
			"validation": {
				"required": true,
				"errorMessage": "Please select a country"
			},
			"placeholder": "Select a country"
		},
		"receiverCity": {
			"type": "text",
			"label": "City",
			"required": true,
			"validation": {
				"required": true,
				"minLength": 2,
				"errorMessage": "City is required"
			},
			"placeholder": "Enter the city"
		},
		"receiverStreet": {
			"type": "text",
			"label": "Street Address",
			"required": false,
			"validation": {
				"required": false,
				"minLength": 5,
				"errorMessage": "Street address is required"
			},
			"placeholder": "Enter the street address"
		},
		"receiverPostalCode": {
			"type": "text",
			"label": "Postal Code",
			"required": true,
			"validation": {
				"required": true,
				"minLength": 3,
				"maxLength": 10,
				"errorMessage": "Postal code must be between 3-10 characters"
			},
			"placeholder": "Enter the postal code"
		}
	}
};
//#endregion
//#region src/routes/api/rules/receiver/+server.ts
/**
* POST /api/rules/receiver
* Returns the rules for the receiver card
*
* Request body:
* - from: { country: string }
* - to:   { country: string }
*/
var POST = async ({ request }) => {
	try {
		const { from, to } = await request.json();
		const senderCountry = from?.country;
		const receiverCountry = to?.country;
		const rules = JSON.parse(JSON.stringify(receiver_card_default));
		rules.fields.receiverCountry.options = countries_default.countries.map((country) => ({
			value: country.name,
			label: country.name
		}));
		const receiverIsGulf = receiverCountry ? isGulfCountry(receiverCountry) : false;
		if (rules.fields.receiverStreet) {
			rules.fields.receiverStreet.required = receiverIsGulf;
			if (rules.fields.receiverStreet.validation) rules.fields.receiverStreet.validation.required = receiverIsGulf;
		}
		const validationErrors = {};
		if ((senderCountry ? isGulfCountry(senderCountry) : false) && receiverCountry === "Iraq") validationErrors.receiverCountry = "Shipping from Gulf countries to Iraq is not currently available";
		return json({
			...rules,
			enabled: true,
			validationErrors,
			context: {
				senderCountry,
				receiverCountry
			}
		});
	} catch (err) {
		console.error("Error loading receiver rules:", err);
		return json({ error: "Failed to load receiver rules" }, { status: 500 });
	}
};
//#endregion
export { POST };
