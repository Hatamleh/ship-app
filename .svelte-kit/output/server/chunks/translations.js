//#region src/lib/translations.ts
var translations = {
	common: {
		loading: "Loading...",
		save: "Save",
		cancel: "Cancel",
		delete: "Delete",
		edit: "Edit",
		view: "View",
		search: "Search",
		filter: "Filter",
		export: "Export",
		import: "Import",
		yes: "Yes",
		no: "No",
		ok: "OK",
		close: "Close",
		back: "Back",
		next: "Next",
		previous: "Previous",
		submit: "Submit",
		required: "Required"
	},
	nav: {
		createShipment: "Create Shipment",
		myShipments: "My Shipments",
		logout: "Log Out"
	},
	auth: {
		login: "Log In",
		register: "Sign Up",
		registerTitle: "Create a New Account",
		loginTitle: "Log In",
		email: "Email",
		password: "Password",
		fullName: "Full Name",
		phone: "Phone Number",
		country: "Country",
		city: "City",
		street: "Street",
		postalCode: "Postal Code",
		alreadyHaveAccount: "Already have an account?",
		dontHaveAccount: "Don't have an account?",
		loginHere: "Log in here",
		registerHere: "Sign up here"
	},
	form: {
		senderInformation: "Sender Information",
		receiverInformation: "Receiver Information",
		packageDetails: "Package Details",
		serviceSelection: "Service Selection",
		additionalOptions: "Additional Options",
		rate: "Rate",
		name: "Name",
		phone: "Phone Number",
		country: "Country",
		city: "City",
		street: "Street",
		postalCode: "Postal Code",
		senderName: "Sender Name",
		senderPhone: "Sender Phone",
		senderCountry: "Sender Country",
		senderCity: "Sender City",
		senderStreet: "Sender Street",
		senderPostalCode: "Sender Postal Code",
		receiverName: "Receiver Name",
		receiverPhone: "Receiver Phone",
		receiverCountry: "Receiver Country",
		receiverCity: "Receiver City",
		receiverStreet: "Receiver Street",
		receiverPostalCode: "Receiver Postal Code",
		weight: "Weight (kg)",
		length: "Length (cm)",
		width: "Width (cm)",
		height: "Height (cm)",
		itemDescription: "Item Description",
		signatureRequired: "Signature Required",
		containsLiquid: "Contains Liquid",
		insurance: "Insurance",
		packaging: "Professional Packaging",
		pickupMethod: "Pickup Method",
		homePickup: "Home Pickup",
		dropOff: "Drop Off at Postal Office",
		saveDraft: "Save as Draft",
		finalizeShipment: "Finalize Shipment",
		saving: "Saving...",
		finalizing: "Finalizing...",
		completePreviousSection: "Complete the previous section to unlock this card",
		loadingCard: "Loading card...",
		loadingServices: "Loading services...",
		loadingOptions: "Loading options...",
		selectServiceToSeePricing: "Select a service to see pricing"
	},
	shipmentTypes: {
		Domestic: "Domestic",
		IntraGulf: "Intra-Gulf",
		International: "International"
	},
	rate: {
		totalPrice: "Total Price",
		baseShippingCost: "Base Shipping Cost",
		signatureRequired: "Signature Required",
		insurance: "Insurance",
		packaging: "Professional Packaging",
		liquidHandling: "Liquid Handling",
		day: "day",
		days: "days",
		base: "Base"
	},
	table: {
		title: "My Shipments",
		trackingNumber: "Tracking Number",
		from: "From",
		to: "To",
		service: "Service",
		status: "Status",
		totalPrice: "Price",
		actions: "Actions",
		noShipments: "No shipments found",
		createFirstShipment: "Create your first shipment!",
		createShipment: "Create Shipment",
		repeat: "Repeat",
		viewDetails: "View Details"
	},
	status: {
		Draft: "Draft",
		Pending: "Pending",
		Processing: "Processing",
		InTransit: "In Transit",
		Delivered: "Delivered",
		Cancelled: "Cancelled"
	},
	details: {
		title: "Shipment Details",
		trackingNumber: "Tracking Number",
		status: "Status",
		createdAt: "Created At",
		sender: "Sender",
		receiver: "Receiver",
		package: "Package",
		service: "Service",
		options: "Options",
		pricing: "Pricing",
		weight: "Weight",
		dimensions: "Dimensions",
		description: "Description",
		serviceType: "Service Type",
		pickupMethod: "Pickup Method",
		shipmentType: "Shipment Type"
	},
	errors: {
		general: "Something went wrong",
		required: "This field is required",
		invalidEmail: "Invalid email address",
		invalidPhone: "Invalid phone number",
		minLength: "Minimum {min} characters",
		maxLength: "Maximum {max} characters",
		invalidFormat: "Invalid format",
		validNumber: "Please enter a valid number",
		minValue: "Value must be at least {min}",
		maxValue: "Value cannot exceed {max}",
		selectService: "Please select a service",
		loginFailed: "Login failed",
		registerFailed: "Registration failed",
		emailAlreadyExists: "Email already exists",
		invalidCredentials: "Invalid credentials",
		shipmentNotFound: "Shipment not found",
		failedToLoadShipment: "Failed to load shipment",
		failedToCreateShipment: "Failed to create shipment",
		failedToUpdateShipment: "Failed to update shipment",
		gulfToIraqNotAllowed: "Shipping from Gulf countries to Iraq is not currently available",
		validationFailed: "Please correct the errors in the form",
		pleaseFixErrors: "Please fix the following errors"
	},
	placeholders: {
		selectCountry: "Select a country",
		enterName: "Enter the name",
		enterPhone: "Enter the phone number",
		enterCity: "Enter the city",
		enterStreet: "Enter the street",
		enterPostalCode: "Enter the postal code",
		enterWeight: "Enter the weight",
		enterLength: "Enter the length",
		enterWidth: "Enter the width",
		enterHeight: "Enter the height",
		enterDescription: "Enter the description",
		enterEmail: "Enter your email",
		enterPassword: "Enter your password"
	},
	ai: {
		title: "Shipping Assistant",
		openChat: "Open assistant",
		closeChat: "Close assistant",
		placeholder: "Ask about your shipments or shipping rules...",
		send: "Send",
		thinking: "Thinking...",
		sources: "Sources",
		toolCalls: "Tools used",
		emptyState: "Ask me about your shipments, pricing, or shipping rules.",
		missingKey: "OPENROUTER_API_KEY is not set. Add your own key to .env — get one at https://openrouter.ai/keys",
		failed: "The assistant could not answer that. Please try again."
	}
};
function t(key, params) {
	const keys = key.split(".");
	let value = translations;
	for (const k of keys) value = value?.[k];
	if (typeof value !== "string") {
		console.warn(`Translation missing for key: ${key}`);
		return key;
	}
	if (params) Object.keys(params).forEach((param) => {
		value = value.replace(`{${param}}`, String(params[param]));
	});
	return value;
}
//#endregion
export { t };
