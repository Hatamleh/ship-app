import { t as shipmentRepository } from "../../../../../chunks/repositories.js";
import { n as calculateRateFromFormData } from "../../../../../chunks/rate-calculator.js";
import { i as validateCompleteShipment } from "../../../../../chunks/shipment-validator.js";
import { t as requireUser } from "../../../../../chunks/guard.js";
import { t as toShipmentFormData } from "../../../../../chunks/shipment-payload.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/shipments/finalize/+server.ts
/**
* POST /api/shipments/finalize
* Create a finalized shipment: full business-rule validation, then a
* server-side rate calculation. Prices sent by the client are ignored.
*/
var POST = async (event) => {
	const user = requireUser(event);
	try {
		const formData = toShipmentFormData(await event.request.json());
		const validation = validateCompleteShipment(formData);
		if (!validation.isValid) return json({
			error: "Validation failed",
			validationErrors: validation.errors
		}, { status: 400 });
		let rateCalculation;
		try {
			rateCalculation = calculateRateFromFormData(formData);
		} catch (err) {
			return json({
				error: "Failed to calculate cost",
				details: err instanceof Error ? err.message : "Invalid service or weight"
			}, { status: 400 });
		}
		const rateData = {
			base: rateCalculation.breakdown.baseCost,
			insurance: rateCalculation.breakdown.insuranceCost,
			signature: rateCalculation.breakdown.signatureCost,
			packaging: rateCalculation.breakdown.packagingCost,
			total: rateCalculation.totalPrice
		};
		const draft = await shipmentRepository.create(user.id, formData, rateData);
		const shipment = await shipmentRepository.finalize(draft.id, user.id);
		return json({
			success: true,
			message: "Shipment finalized successfully",
			shipment,
			rateBreakdown: rateCalculation.breakdown
		}, { status: 201 });
	} catch (err) {
		console.error("Error finalizing shipment:", err);
		return json({
			error: "Failed to finalize shipment",
			details: err instanceof Error ? err.message : void 0
		}, { status: 400 });
	}
};
//#endregion
export { POST };
