import { E as attr, O as escape_html, i as derived, o as ensure_array_like, p as stringify, s as head } from "../../../../chunks/server.js";
import "../../../../chunks/navigation.js";
import { t } from "../../../../chunks/translations.js";
//#region src/routes/shipments/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const shipment = derived(() => data.shipment);
		const isDraft = derived(() => shipment().status === "draft");
		let working = false;
		const options = derived(() => [
			{
				label: t("rate.insurance"),
				on: shipment().options.insurance
			},
			{
				label: t("form.signatureRequired"),
				on: shipment().options.signature
			},
			{
				label: t("form.packaging"),
				on: shipment().options.packaging
			},
			{
				label: t("form.containsLiquid"),
				on: shipment().options.liquid
			}
		].filter((o) => o.on));
		const costLines = derived(() => [
			{
				label: t("rate.signatureRequired"),
				value: shipment().rate.signature
			},
			{
				label: t("rate.insurance"),
				value: shipment().rate.insurance
			},
			{
				label: t("rate.packaging"),
				value: shipment().rate.packaging
			}
		].filter((line) => line.value > 0));
		head("h1ivo4", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(isDraft() ? `Draft Shipment #${shipment().id}` : shipment().trackingNumber)} - My Shipments</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><a href="/shipments" class="text-primary hover:text-nord-frost-3 text-sm mb-4 inline-block">← Back to Shipments</a> <div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-foreground">${escape_html(isDraft() ? `Draft Shipment #${shipment().id}` : shipment().trackingNumber)}</h1> <p class="mt-2 text-muted-foreground">Created on ${escape_html(new Date(shipment().createdAt).toLocaleDateString("en-US"))}</p></div> <div class="flex items-center gap-4">`);
		if (isDraft()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="px-3 py-1 text-sm font-medium rounded-full bg-nord-polar-2 text-foreground">Draft</span> <a${attr("href", `/?edit=${stringify(shipment().id)}`)} class="px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-nord-polar-2">Edit</a> <button type="button"${attr("disabled", working, true)} class="px-4 py-2 text-sm bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 disabled:opacity-50">${escape_html("Finalize Shipment")}</button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="px-3 py-1 text-sm font-medium rounded-full bg-nord-aurora-green/20 text-premium">Finalized</span> <a${attr("href", `/?repeat=${stringify(shipment().id)}`)} class="px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-nord-polar-2">Repeat</a>`);
		}
		$$renderer.push(`<!--]--> <button type="button"${attr("disabled", working, true)} class="px-4 py-2 text-sm text-destructive border border-destructive rounded-md hover:bg-nord-aurora-red/20 disabled:opacity-50">Delete</button></div></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><section aria-labelledby="sender-heading" class="bg-muted p-6 rounded-lg shadow border border-border"><h2 id="sender-heading" class="text-lg font-semibold mb-4 text-foreground">Sender Information</h2> <dl class="space-y-3"><div><dt class="text-sm text-muted-foreground">Name</dt> <dd class="font-medium text-foreground">${escape_html(shipment().from.name)}</dd></div> <div><dt class="text-sm text-muted-foreground">Phone</dt> <dd class="font-medium text-foreground">${escape_html(shipment().from.phone)}</dd></div> <div><dt class="text-sm text-muted-foreground">Address</dt> <dd class="font-medium text-foreground">${escape_html(shipment().from.street)}, ${escape_html(shipment().from.city)}, ${escape_html(shipment().from.country)}
          ${escape_html(shipment().from.postalCode)}</dd></div></dl></section> <section aria-labelledby="receiver-heading" class="bg-muted p-6 rounded-lg shadow border border-border"><h2 id="receiver-heading" class="text-lg font-semibold mb-4 text-foreground">Receiver Information</h2> <dl class="space-y-3"><div><dt class="text-sm text-muted-foreground">Name</dt> <dd class="font-medium text-foreground">${escape_html(shipment().to.name)}</dd></div> <div><dt class="text-sm text-muted-foreground">Phone</dt> <dd class="font-medium text-foreground">${escape_html(shipment().to.phone)}</dd></div> <div><dt class="text-sm text-muted-foreground">Address</dt> <dd class="font-medium text-foreground">${escape_html(shipment().to.street)}, ${escape_html(shipment().to.city)}, ${escape_html(shipment().to.country)}
          ${escape_html(shipment().to.postalCode)}</dd></div></dl></section> <section aria-labelledby="package-heading" class="bg-muted p-6 rounded-lg shadow border border-border"><h2 id="package-heading" class="text-lg font-semibold mb-4 text-foreground">Package Details</h2> <dl class="space-y-3"><div><dt class="text-sm text-muted-foreground">Shipment Type</dt> <dd class="font-medium text-foreground">${escape_html(t(`shipmentTypes.${shipment().service.shipmentType}`))}</dd></div> <div><dt class="text-sm text-muted-foreground">Weight</dt> <dd class="font-medium text-foreground">${escape_html(shipment().package.weight)} kg</dd></div> <div><dt class="text-sm text-muted-foreground">Dimensions (L × W × H)</dt> <dd class="font-medium text-foreground">${escape_html(shipment().package.length)} × ${escape_html(shipment().package.width)} × ${escape_html(shipment().package.height)} cm</dd></div> `);
		if (shipment().package.description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div><dt class="text-sm text-muted-foreground">Item Description</dt> <dd class="font-medium text-foreground">${escape_html(shipment().package.description)}</dd></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></dl></section> <section aria-labelledby="service-heading" class="bg-muted p-6 rounded-lg shadow border border-border"><h2 id="service-heading" class="text-lg font-semibold mb-4 text-foreground">Service &amp; Options</h2> <dl class="space-y-3"><div><dt class="text-sm text-muted-foreground">Service Type</dt> <dd class="font-medium text-foreground">${escape_html(shipment().service.type)}</dd></div> <div><dt class="text-sm text-muted-foreground">Pickup Method</dt> <dd class="font-medium text-foreground">${escape_html(shipment().service.pickupMethod === "home" ? "Home Pickup" : "Drop Off at Postal Office")}</dd></div> <div><dt class="text-sm text-muted-foreground">Additional Options</dt> <dd class="font-medium text-foreground">`);
		if (options().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-muted-foreground">No additional options selected</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<ul class="list-disc pl-5"><!--[-->`);
			const each_array = ensure_array_like(options());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let option = each_array[$$index];
				$$renderer.push(`<li>${escape_html(option.label)}</li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></dd></div></dl></section></div> <section aria-labelledby="cost-heading" class="bg-muted p-6 rounded-lg shadow border border-border"><h2 id="cost-heading" class="text-lg font-semibold mb-4 text-foreground">Cost Details</h2> <dl class="space-y-2"><div class="flex justify-between"><dt class="text-muted-foreground">Base Shipping Cost</dt> <dd class="text-foreground">$${escape_html(shipment().rate.base.toFixed(2))}</dd></div> <!--[-->`);
		const each_array_1 = ensure_array_like(costLines());
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let line = each_array_1[$$index_1];
			$$renderer.push(`<div class="flex justify-between"><dt class="text-muted-foreground">${escape_html(line.label)}</dt> <dd class="text-foreground">$${escape_html(line.value.toFixed(2))}</dd></div>`);
		}
		$$renderer.push(`<!--]--> <div class="flex justify-between pt-3 border-t border-border"><dt class="text-lg font-semibold text-foreground">Total Cost</dt> <dd class="text-lg font-bold text-primary">$${escape_html(shipment().rate.total.toFixed(2))}</dd></div></dl></section>`);
	});
}
//#endregion
export { _page as default };
