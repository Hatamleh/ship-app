import { t as countries_default } from "./countries.js";
var package_card_default = {
	shipmentTypes: {
		"Domestic": {
			"maxWeight": 50,
			"maxDimension": 200
		},
		"IntraGulf": {
			"maxWeight": 30,
			"maxDimension": 200
		},
		"International": {
			"maxWeight": 25,
			"maxDimension": 200
		}
	},
	cardName: "package",
	title: "Package Information",
	enabled: false,
	fields: {
		"weight": {
			"type": "number",
			"label": "Weight (kg)",
			"required": true,
			"validation": {
				"required": true,
				"min": .1,
				"errorMessage": "Weight must be greater than 0"
			},
			"placeholder": "Enter the weight in kilograms"
		},
		"length": {
			"type": "number",
			"label": "Length (cm)",
			"required": true,
			"validation": {
				"required": true,
				"min": 1,
				"max": 200,
				"errorMessage": "Length must be between 1-200 cm"
			},
			"placeholder": "Enter the length"
		},
		"width": {
			"type": "number",
			"label": "Width (cm)",
			"required": true,
			"validation": {
				"required": true,
				"min": 1,
				"max": 200,
				"errorMessage": "Width must be between 1-200 cm"
			},
			"placeholder": "Enter the width"
		},
		"height": {
			"type": "number",
			"label": "Height (cm)",
			"required": true,
			"validation": {
				"required": true,
				"min": 1,
				"max": 200,
				"errorMessage": "Height must be between 1-200 cm"
			},
			"placeholder": "Enter the height"
		},
		"itemDescription": {
			"type": "text",
			"label": "Item Description",
			"required": false,
			"visible": false,
			"validation": {
				"required": false,
				"minLength": 5,
				"maxLength": 200,
				"errorMessage": "Item description is required when shipping from outside the Gulf into a Gulf country"
			},
			"placeholder": "Describe the package contents"
		}
	}
};
//#endregion
//#region src/lib/server/validators/shipment-validator.ts
/**
* Shipment Validation Service
* Centralizes all business rule validations for shipments
* Ensures backend enforcement of all 130+ business rules
*/
/**
* Check if a country is a Gulf country.
* Exported so the rules API routes share this single definition instead of
* keeping their own copies, which is how the two previously drifted apart.
*/
function isGulfCountry(countryName) {
	return countries_default.countries.find((c) => c.name === countryName)?.isGulf || false;
}
/**
* Determine shipment type based on sender and receiver countries
*/
function determineShipmentType(senderCountry, receiverCountry) {
	if (senderCountry === receiverCountry) return "Domestic";
	if (isGulfCountry(senderCountry) && isGulfCountry(receiverCountry)) return "IntraGulf";
	return "International";
}
/**
* Validate sender data against business rules
*/
function validateSenderData(data) {
	const errors = {};
	if (!data.senderName || data.senderName.trim().length < 2) errors.senderName = "Sender name must be at least 2 characters";
	if (!data.senderPhone) errors.senderPhone = "Sender phone number is required";
	else if (data.senderPhone.replace(/\D/g, "").length < 10) errors.senderPhone = "Phone number must contain at least 10 digits";
	if (!data.senderCountry) errors.senderCountry = "Sender country is required";
	if (!data.senderCity || data.senderCity.trim().length < 2) errors.senderCity = "Sender city must be at least 2 characters";
	if (!data.senderPostalCode || data.senderPostalCode.trim().length < 3) errors.senderPostalCode = "Sender postal code must be at least 3 characters";
	if (data.senderCountry ? isGulfCountry(data.senderCountry) : false) {
		if (!data.senderStreet || data.senderStreet.trim().length === 0) errors.senderStreet = "Street address is required for Gulf countries";
	}
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
/**
* Validate receiver data against business rules
*/
function validateReceiverData(data, senderCountry) {
	const errors = {};
	if (!data.receiverName || data.receiverName.trim().length < 2) errors.receiverName = "Receiver name must be at least 2 characters";
	if (!data.receiverPhone) errors.receiverPhone = "Receiver phone number is required";
	else if (data.receiverPhone.replace(/\D/g, "").length < 10) errors.receiverPhone = "Phone number must contain at least 10 digits";
	if (!data.receiverCountry) errors.receiverCountry = "Receiver country is required";
	if (!data.receiverCity || data.receiverCity.trim().length < 2) errors.receiverCity = "Receiver city must be at least 2 characters";
	if (!data.receiverPostalCode || data.receiverPostalCode.trim().length < 3) errors.receiverPostalCode = "Receiver postal code must be at least 3 characters";
	if (data.receiverCountry ? isGulfCountry(data.receiverCountry) : false) {
		if (!data.receiverStreet || data.receiverStreet.trim().length === 0) errors.receiverStreet = "Street address is required for Gulf countries";
	}
	if (senderCountry && data.receiverCountry) {
		if (isGulfCountry(senderCountry) && data.receiverCountry === "Iraq") errors.receiverCountry = "Shipping from Gulf countries to Iraq is not currently available";
	}
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
/**
* Validate package data against business rules
*/
function validatePackageData(data, shipmentType) {
	const errors = {};
	if (!data.weight || data.weight <= 0) errors.weight = "Weight must be greater than 0 kg";
	else {
		const typeRules = package_card_default.shipmentTypes[shipmentType];
		if (typeRules && data.weight > typeRules.maxWeight) errors.weight = `Weight cannot exceed ${typeRules.maxWeight} kg for ${shipmentType} shipments`;
	}
	if (!data.length || data.length <= 0) errors.length = "Length must be greater than 0 cm";
	else if (data.length > 200) errors.length = "Length cannot exceed 200 cm";
	if (!data.width || data.width <= 0) errors.width = "Width must be greater than 0 cm";
	else if (data.width > 200) errors.width = "Width cannot exceed 200 cm";
	if (!data.height || data.height <= 0) errors.height = "Height must be greater than 0 cm";
	else if (data.height > 200) errors.height = "Height cannot exceed 200 cm";
	if (data.senderCountry && data.receiverCountry) {
		const isSenderGulf = isGulfCountry(data.senderCountry);
		const isReceiverGulf = isGulfCountry(data.receiverCountry);
		if (!isSenderGulf && isReceiverGulf) {
			if (!data.itemDescription || data.itemDescription.trim().length < 5) errors.itemDescription = "Item description is required (minimum 5 characters) when shipping from outside the Gulf into a Gulf country";
		}
	}
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
/**
* Validate additional options against business rules
*/
function validateAdditionalOptions(data) {
	const errors = {};
	if (data.receiverCountry === "Jordan" || data.receiverCountry === "Egypt") {
		if (!data.signatureRequired) errors.signatureRequired = `Signature is required when shipping to ${data.receiverCountry}`;
	}
	if (data.weight && data.weight > 17 && data.senderCountry !== "Iraq") {
		if (data.pickupMethod === "home") errors.pickupMethod = "Home pickup is not available for packages over 17 kg. Please choose drop off at a postal office";
	}
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
/**
* Validate service selection
*/
function validateServiceSelection(data) {
	const errors = {};
	if (!data.serviceType) errors.serviceType = "Service type is required";
	if (!data.shipmentType) errors.shipmentType = "Shipment type is required";
	if (!data.pickupMethod) errors.pickupMethod = "Pickup method is required";
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
/**
* Validate complete shipment data (for finalization)
* Runs all validation checks
*/
function validateCompleteShipment(data) {
	const allErrors = {};
	const shipmentType = determineShipmentType(data.senderCountry, data.receiverCountry);
	const senderValidation = validateSenderData(data);
	const receiverValidation = validateReceiverData(data, data.senderCountry);
	const packageValidation = validatePackageData(data, shipmentType);
	const optionsValidation = validateAdditionalOptions(data);
	const serviceValidation = validateServiceSelection(data);
	Object.assign(allErrors, senderValidation.errors);
	Object.assign(allErrors, receiverValidation.errors);
	Object.assign(allErrors, packageValidation.errors);
	Object.assign(allErrors, optionsValidation.errors);
	Object.assign(allErrors, serviceValidation.errors);
	return {
		isValid: Object.keys(allErrors).length === 0,
		errors: allErrors
	};
}
/**
* Validate draft shipment data (minimal validation)
* Only checks data types and basic structure
*/
function validateDraftShipment(data) {
	const errors = {};
	if (data.weight !== void 0 && (isNaN(Number(data.weight)) || Number(data.weight) < 0)) errors.weight = "Weight must be a valid number";
	if (data.length !== void 0 && (isNaN(Number(data.length)) || Number(data.length) < 0)) errors.length = "Length must be a valid number";
	if (data.width !== void 0 && (isNaN(Number(data.width)) || Number(data.width) < 0)) errors.width = "Width must be a valid number";
	if (data.height !== void 0 && (isNaN(Number(data.height)) || Number(data.height) < 0)) errors.height = "Height must be a valid number";
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}
//#endregion
export { validateDraftShipment as a, validateSenderData as c, validateCompleteShipment as i, package_card_default as l, isGulfCountry as n, validatePackageData as o, validateAdditionalOptions as r, validateReceiverData as s, determineShipmentType as t };
