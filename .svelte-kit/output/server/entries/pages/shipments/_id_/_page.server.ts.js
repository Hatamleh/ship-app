import { t as shipmentRepository } from "../../../../chunks/repositories.js";
import { error } from "@sveltejs/kit";
//#region src/routes/shipments/[id]/+page.server.ts
/**
* Loads the shipment on the server.
*
* The React version fetched this from the browser after mount and rendered a
* loading state. Here it arrives with the page, and a shipment belonging to
* someone else is a clean 404 because findById is scoped to the user.
*/
var load = async ({ params, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) error(400, "Invalid shipment ID");
	const shipment = await shipmentRepository.findById(id, locals.user.id);
	if (!shipment) error(404, "Shipment not found");
	return { shipment };
};
//#endregion
export { load };
