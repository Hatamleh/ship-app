import { t as service_card_default } from "./service-card.js";
var pricing_default = {
	pickupFees: {
		"Saudi Arabia": {
			"home": 8,
			"postal_office": 3
		},
		"United Arab Emirates": {
			"home": 10,
			"postal_office": 3
		},
		"Kuwait": {
			"home": 7,
			"postal_office": 2.5
		},
		"Bahrain": {
			"home": 6,
			"postal_office": 2
		},
		"Oman": {
			"home": 7,
			"postal_office": 2.5
		},
		"Qatar": {
			"home": 8,
			"postal_office": 3
		},
		"Jordan": {
			"home": 12,
			"postal_office": 4
		},
		"Lebanon": {
			"home": 12,
			"postal_office": 4
		},
		"Egypt": {
			"home": 15,
			"postal_office": 5
		},
		"Iraq": {
			"home": 18,
			"postal_office": 6
		}
	},
	defaultPickupFees: {
		"home": 20,
		"postal_office": 8
	},
	additionalFees: {
		"signature": 5,
		"liquid": 10,
		"insurance": 15,
		"packaging": 8
	}
};
//#endregion
//#region src/lib/server/services/rate-calculator.ts
/**
* Rate Calculation Service
* Server-side price calculation to prevent price manipulation
* Never trust prices sent from the frontend!
*/
/**
* Find service by ID across all shipment types
*/
function findService(serviceId) {
	for (const [shipmentType, services] of Object.entries(service_card_default.servicesByShipmentType)) {
		const service = services.find((s) => s.id === serviceId);
		if (service) return service;
	}
	return null;
}
/**
* Get pickup/dropoff fee for a country
*/
function getPickupFee(country, method) {
	const countryFees = pricing_default.pickupFees[country];
	if (countryFees) return countryFees[method];
	return pricing_default.defaultPickupFees[method];
}
/**
* Calculate shipment rate server-side
* This is the source of truth - never trust frontend calculations
*/
function calculateRate(input) {
	const service = findService(input.serviceId);
	if (!service) throw new Error(`Service not found: ${input.serviceId}`);
	if (input.weight > service.maxWeight) throw new Error(`Weight ${input.weight}kg exceeds service maximum of ${service.maxWeight}kg`);
	const serviceBaseCost = service.basePrice + input.weight * service.pricePerKg;
	const pickupFee = getPickupFee(input.senderCountry, input.pickupMethod);
	const signatureCost = input.signatureRequired ? pricing_default.additionalFees.signature : 0;
	const liquidCost = input.containsLiquid ? pricing_default.additionalFees.liquid : 0;
	const insuranceCost = input.insurance ? pricing_default.additionalFees.insurance : 0;
	const packagingCost = input.packaging ? pricing_default.additionalFees.packaging : 0;
	const baseCost = serviceBaseCost + pickupFee;
	const totalPrice = baseCost + signatureCost + liquidCost + insuranceCost + packagingCost;
	return {
		breakdown: {
			baseCost: parseFloat(baseCost.toFixed(2)),
			signatureCost: parseFloat(signatureCost.toFixed(2)),
			insuranceCost: parseFloat(insuranceCost.toFixed(2)),
			packagingCost: parseFloat(packagingCost.toFixed(2)),
			liquidCost: parseFloat(liquidCost.toFixed(2))
		},
		totalPrice: parseFloat(totalPrice.toFixed(2)),
		serviceInfo: {
			name: service.name,
			basePrice: service.basePrice,
			pricePerKg: service.pricePerKg,
			maxWeight: service.maxWeight
		}
	};
}
/**
* Calculate rate from ShipmentFormData
* Convenience method that extracts rate calculation input from form data
*/
function calculateRateFromFormData(data) {
	if (!data.serviceType) throw new Error("Service type is required for rate calculation");
	return calculateRate({
		serviceId: data.serviceType,
		weight: data.weight,
		senderCountry: data.senderCountry,
		receiverCountry: data.receiverCountry,
		pickupMethod: data.pickupMethod,
		signatureRequired: data.signatureRequired,
		containsLiquid: data.containsLiquid,
		insurance: data.insurance,
		packaging: data.packaging
	});
}
//#endregion
export { calculateRateFromFormData as n, calculateRate as t };
