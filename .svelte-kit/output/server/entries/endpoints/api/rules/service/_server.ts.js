import { t as service_card_default } from "../../../../../chunks/service-card.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/rules/service/+server.ts
/**
* POST /api/rules/service
* Returns the available services for a shipment type, filtered by weight
*
* Request body:
* - shipmentType: (required) Domestic | IntraGulf | International
* - package: { weight: number }
*/
var POST = async ({ request }) => {
	try {
		const { shipmentType, package: pkg } = await request.json();
		const weight = pkg?.weight;
		if (!shipmentType) return json({ error: "shipmentType is required" }, { status: 400 });
		if (![
			"Domestic",
			"IntraGulf",
			"International"
		].includes(shipmentType)) return json({ error: "Invalid shipment type" }, { status: 400 });
		const services = service_card_default.servicesByShipmentType[shipmentType];
		if (!services) return json({ error: "No services found for this shipment type" }, { status: 404 });
		let availableServices = services;
		const weightNum = parseFloat(weight);
		if (!isNaN(weightNum)) availableServices = services.filter((service) => weightNum <= service.maxWeight);
		return json({
			cardName: service_card_default.cardName,
			title: service_card_default.title,
			enabled: true,
			shipmentType,
			services: availableServices,
			context: { weight: isNaN(weightNum) ? null : weightNum }
		});
	} catch (err) {
		console.error("Error loading service rules:", err);
		return json({ error: "Failed to load service rules" }, { status: 500 });
	}
};
//#endregion
export { POST };
