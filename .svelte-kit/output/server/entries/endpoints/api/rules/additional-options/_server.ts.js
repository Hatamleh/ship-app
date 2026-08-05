import { json } from "@sveltejs/kit";
var additional_options_default = {
	cardName: "additionalOptions",
	title: "Additional Options",
	enabled: false,
	fields: {
		"signatureRequired": {
			"type": "checkbox",
			"label": "Signature Required",
			"checked": false,
			"disabled": false
		},
		"containsLiquid": {
			"type": "checkbox",
			"label": "Contains Liquid",
			"checked": false,
			"disabled": false
		},
		"insurance": {
			"type": "checkbox",
			"label": "Insurance ($15.00)",
			"checked": false,
			"disabled": false
		},
		"packaging": {
			"type": "checkbox",
			"label": "Professional Packaging ($8.00)",
			"checked": false,
			"disabled": false
		},
		"pickupMethod": {
			"type": "radio",
			"label": "Pickup Method",
			"options": [{
				"value": "home",
				"label": "Home Pickup"
			}, {
				"value": "postal_office",
				"label": "Drop Off at Postal Office"
			}],
			"defaultValue": "home",
			"allowedValues": ["home", "postal_office"],
			"disabledValues": []
		}
	}
};
//#endregion
//#region src/routes/api/rules/additional-options/+server.ts
/**
* POST /api/rules/additional-options
* Returns the rules for the additional options card
*
* Request body:
* - from: { country: string }
* - to:   { country: string }
* - package: { weight: number }
*/
var POST = async ({ request }) => {
	try {
		const { from, to, package: pkg } = await request.json();
		const senderCountry = from?.country;
		const receiverCountry = to?.country;
		const weight = pkg?.weight ? parseFloat(pkg.weight) : 0;
		const rules = JSON.parse(JSON.stringify(additional_options_default));
		const signatureMandatory = receiverCountry === "Jordan" || receiverCountry === "Egypt";
		if (rules.fields.signatureRequired) {
			rules.fields.signatureRequired.checked = signatureMandatory;
			rules.fields.signatureRequired.disabled = signatureMandatory;
		}
		const isSenderIraq = senderCountry === "Iraq";
		const isHeavyPackage = weight > 17;
		if (rules.fields.pickupMethod) {
			if (isHeavyPackage && !isSenderIraq) {
				rules.fields.pickupMethod.allowedValues = ["postal_office"];
				rules.fields.pickupMethod.defaultValue = "postal_office";
				rules.fields.pickupMethod.disabledValues = ["home"];
			} else {
				rules.fields.pickupMethod.allowedValues = ["home", "postal_office"];
				rules.fields.pickupMethod.defaultValue = "home";
				rules.fields.pickupMethod.disabledValues = [];
			}
		}
		return json({
			cardName: rules.cardName,
			title: rules.title,
			enabled: true,
			fields: rules.fields,
			context: {
				senderCountry,
				receiverCountry,
				weight
			}
		});
	} catch (err) {
		console.error("Error loading additional options rules:", err);
		return json({ error: "Failed to load additional options" }, { status: 500 });
	}
};
//#endregion
export { POST };
