import { t as shipmentRepository } from "../../../chunks/repositories.js";
//#region src/routes/shipments/+page.server.ts
/**
* Loads the shipment list on the server so the table is in the first response
* rather than appearing after a client fetch.
*
* Filters live in the query string, which means a filtered view is a real URL
* you can share, reload and go back to.
*/
var load = async ({ locals, url }) => {
	const status = url.searchParams.get("status") ?? "all";
	const shipmentType = url.searchParams.get("type") ?? "all";
	const { shipments } = await shipmentRepository.findByUserId(locals.user.id, {
		status: status === "all" ? void 0 : status,
		shipmentType: shipmentType === "all" ? void 0 : shipmentType,
		sortBy: "createdAt",
		sortOrder: "desc",
		limit: 100
	});
	return {
		shipments,
		status,
		shipmentType
	};
};
//#endregion
export { load };
