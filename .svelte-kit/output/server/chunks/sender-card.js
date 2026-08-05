var sender_card_default = {
	cardName: "sender",
	title: "Sender Information",
	enabled: true,
	fields: {
		"senderName": {
			"type": "text",
			"label": "Full Name",
			"required": true,
			"validation": {
				"required": true,
				"minLength": 2,
				"errorMessage": "Name must be at least 2 characters"
			},
			"placeholder": "Enter the sender's full name"
		},
		"senderPhone": {
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
		"senderCountry": {
			"type": "select",
			"label": "Country",
			"required": true,
			"validation": {
				"required": true,
				"errorMessage": "Please select a country"
			},
			"placeholder": "Select a country"
		},
		"senderCity": {
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
		"senderStreet": {
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
		"senderPostalCode": {
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
export { sender_card_default as t };
