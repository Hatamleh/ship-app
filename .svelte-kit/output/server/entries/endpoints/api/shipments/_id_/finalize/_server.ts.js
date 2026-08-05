import { t as shipmentRepository } from "../../../../../../chunks/repositories.js";
import { n as calculateRateFromFormData } from "../../../../../../chunks/rate-calculator.js";
import { i as validateCompleteShipment } from "../../../../../../chunks/shipment-validator.js";
import { t as requireUser } from "../../../../../../chunks/guard.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/shipments/[id]/finalize/+server.ts
/**
* POST /api/shipments/[id]/finalize
* Finalize an existing draft: full validation plus a server-side rate
* recalculation, so a draft saved with stale prices is corrected on the way out.
*/
var POST = async (event) => {
	const user = requireUser(event);
	try {
		const id = parseInt(event.params.id);
		if (isNaN(id)) return json({ error: "Invalid shipment ID" }, { status: 400 });
		const shipment = await shipmentRepository.findById(id, user.id);
		if (!shipment) return json({ error: "Shipment not found" }, { status: 404 });
		if (shipment.status !== "draft") return json({ error: "Shipment is already finalized" }, { status: 400 });
		const formData = {
			senderName: shipment.from.name,
			senderPhone: shipment.from.phone,
			senderCountry: shipment.from.country,
			senderCity: shipment.from.city,
			senderStreet: shipment.from.street,
			senderPostalCode: shipment.from.postalCode,
			receiverName: shipment.to.name,
			receiverPhone: shipment.to.phone,
			receiverCountry: shipment.to.country,
			receiverCity: shipment.to.city,
			receiverStreet: shipment.to.street,
			receiverPostalCode: shipment.to.postalCode,
			weight: shipment.package.weight,
			length: shipment.package.length,
			width: shipment.package.width,
			height: shipment.package.height,
			itemDescription: shipment.package.description || "",
			serviceType: shipment.service.type,
			pickupMethod: shipment.service.pickupMethod,
			shipmentType: shipment.service.shipmentType,
			signatureRequired: shipment.options.signature,
			containsLiquid: shipment.options.liquid,
			insurance: shipment.options.insurance,
			packaging: shipment.options.packaging
		};
		const validation = validateCompleteShipment(formData);
		if (!validation.isValid) return json({
			error: "Validation failed",
			validationErrors: validation.errors,
			message: "This draft cannot be finalized because it contains data errors"
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
		await shipmentRepository.update(id, user.id, formData, {
			base: rateCalculation.breakdown.baseCost,
			insurance: rateCalculation.breakdown.insuranceCost,
			signature: rateCalculation.breakdown.signatureCost,
			packaging: rateCalculation.breakdown.packagingCost,
			total: rateCalculation.totalPrice
		});
		const finalized = await shipmentRepository.finalize(id, user.id);
		return json({
			success: true,
			message: "Shipment finalized successfully",
			shipment: finalized,
			rateBreakdown: rateCalculation.breakdown
		});
	} catch (err) {
		console.error("Shipment finalization error:", err);
		return json({
			error: "Failed to finalize shipment",
			details: err instanceof Error ? err.message : "Unknown error"
		}, { status: 500 });
	}
};
//#endregion
export { POST };
