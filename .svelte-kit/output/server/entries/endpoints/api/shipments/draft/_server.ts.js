import { t as shipmentRepository } from "../../../../../chunks/repositories.js";
import { a as validateDraftShipment } from "../../../../../chunks/shipment-validator.js";
import { t as requireUser } from "../../../../../chunks/guard.js";
import { t as toShipmentFormData } from "../../../../../chunks/shipment-payload.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/shipments/draft/+server.ts
/**
* POST /api/shipments/draft
* Save a work-in-progress shipment. Minimal validation only — an incomplete
* draft is allowed; the business rules are enforced at finalize time.
*/
var POST = async (event) => {
	const user = requireUser(event);
	try {
		const body = await event.request.json();
		const formData = toShipmentFormData(body);
		const validation = validateDraftShipment(formData);
		if (!validation.isValid) return json({
			error: "Invalid data format",
			validationErrors: validation.errors
		}, { status: 400 });
		const rates = body?.rates ?? {};
		const rateData = {
			base: Number(rates.base) || 0,
			insurance: Number(rates.insurance) || 0,
			signature: Number(rates.signature) || 0,
			packaging: Number(rates.packaging) || 0,
			total: Number(rates.total) || 0
		};
		const shipment = await shipmentRepository.create(user.id, formData, rateData);
		return json({
			success: true,
			message: "Draft saved successfully",
			shipment
		}, { status: 201 });
	} catch (err) {
		console.error("Error creating draft shipment:", err);
		return json({ error: "Failed to save draft" }, { status: 500 });
	}
};
//#endregion
export { POST };
