import { t as calculateRate } from "../../../../chunks/rate-calculator.js";
import { t as service_card_default } from "../../../../chunks/service-card.js";
import { t as determineShipmentType } from "../../../../chunks/shipment-validator.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/rates/+server.ts
/**
* POST /api/rates
* Calculates the total rate for a service, weight, route and options.
*
* This delegates to calculateRate() rather than repeating the pricing maths.
* The Next version had its own copy, which is exactly how the two Gulf-country
* lookups drifted apart previously.
*
* Request body:
* - serviceId, weight, senderCountry, receiverCountry, pickupMethod (all required)
* - signatureRequired, containsLiquid, insurance, packaging (optional)
*/
var POST = async ({ request }) => {
	try {
		const { serviceId, weight, senderCountry, receiverCountry, pickupMethod, signatureRequired, containsLiquid, insurance, packaging } = await request.json();
		if (!serviceId || !weight || !senderCountry || !receiverCountry || !pickupMethod) return json({ error: "All required fields must be filled" }, { status: 400 });
		if (!Object.values(service_card_default.servicesByShipmentType).flat().some((s) => s.id === serviceId)) return json({ error: "Service not found" }, { status: 404 });
		const result = calculateRate({
			serviceId,
			weight: Number(weight),
			senderCountry,
			receiverCountry,
			pickupMethod,
			signatureRequired: !!signatureRequired,
			containsLiquid: !!containsLiquid,
			insurance: !!insurance,
			packaging: !!packaging
		});
		return json({
			totalPrice: result.totalPrice,
			breakdown: result.breakdown,
			context: {
				serviceName: result.serviceInfo?.name,
				shipmentType: determineShipmentType(senderCountry, receiverCountry),
				weight: Number(weight),
				senderCountry,
				receiverCountry,
				pickupMethod
			}
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to calculate price";
		if (message.includes("exceeds service maximum")) return json({ error: message }, { status: 400 });
		console.error("Error calculating rate:", err);
		return json({ error: "Failed to calculate price" }, { status: 500 });
	}
};
//#endregion
export { POST };
