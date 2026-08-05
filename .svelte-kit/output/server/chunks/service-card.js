var service_card_default = {
	servicesByShipmentType: {
		"Domestic": [{
			"id": "domestic_standard",
			"name": "Domestic Standard",
			"description": "Standard domestic delivery (2-3 business days)",
			"maxWeight": 50,
			"basePrice": 15,
			"pricePerKg": .5,
			"deliveryDays": 3
		}, {
			"id": "domestic_express",
			"name": "Domestic Express",
			"description": "Express domestic delivery (1 business day)",
			"maxWeight": 30,
			"basePrice": 30,
			"pricePerKg": 1,
			"deliveryDays": 1
		}],
		"IntraGulf": [{
			"id": "gulf_standard",
			"name": "Gulf Standard",
			"description": "Standard Gulf shipping (4-5 business days)",
			"maxWeight": 30,
			"basePrice": 25,
			"pricePerKg": 1.5,
			"deliveryDays": 5
		}, {
			"id": "gulf_express",
			"name": "Gulf Express",
			"description": "Express Gulf shipping (2 business days)",
			"maxWeight": 20,
			"basePrice": 45,
			"pricePerKg": 2.5,
			"deliveryDays": 2
		}],
		"International": [{
			"id": "international_economy",
			"name": "International Economy",
			"description": "Economy international shipping (8-10 business days)",
			"maxWeight": 25,
			"basePrice": 35,
			"pricePerKg": 2,
			"deliveryDays": 10
		}, {
			"id": "international_standard",
			"name": "International Standard",
			"description": "Standard international shipping (5-7 business days)",
			"maxWeight": 25,
			"basePrice": 50,
			"pricePerKg": 3,
			"deliveryDays": 7
		}]
	},
	cardName: "service",
	title: "Service Information",
	enabled: false
};
//#endregion
export { service_card_default as t };
