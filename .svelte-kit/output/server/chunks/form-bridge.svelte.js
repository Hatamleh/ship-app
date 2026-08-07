import "./server.js";
//#region src/lib/state/form-bridge.svelte.ts
/** Fields the assistant is allowed to propose. Sender comes from the account. */
var AGENT_WRITABLE_FIELDS = [
	"receiverName",
	"receiverPhone",
	"receiverCountry",
	"receiverCity",
	"receiverStreet",
	"receiverPostalCode",
	"weight",
	"length",
	"width",
	"height",
	"itemDescription",
	"pickupMethod",
	"signatureRequired",
	"containsLiquid",
	"insurance",
	"packaging"
];
//#endregion
export { AGENT_WRITABLE_FIELDS as t };
