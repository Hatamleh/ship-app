import { E as attr, O as escape_html, o as ensure_array_like, s as head } from "../../../chunks/server.js";
import { t as countries_default } from "../../../chunks/countries.js";
import "../../../chunks/navigation.js";
import { t } from "../../../chunks/translations.js";
//#region src/routes/register/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let form = {
			email: "",
			password: "",
			confirmPassword: "",
			fullName: "",
			phone: "",
			country: "",
			city: "",
			street: "",
			postalCode: ""
		};
		let loading = false;
		head("52fghe", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Sign Up - My Shipments</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-2xl w-full space-y-8"><div><img src="/ship-logo.svg" alt="ShipApp" class="mx-auto h-14 w-14"/> <h1 class="mt-6 text-center text-3xl font-extrabold text-foreground">${escape_html(t("auth.registerTitle"))}</h1></div> <form class="mt-8 space-y-6">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <fieldset class="bg-muted p-6 rounded-lg shadow border border-border"><legend class="text-lg font-semibold mb-4 text-primary">Account Information</legend> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label for="email" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.email"))}</label> <input id="email" type="email" autocomplete="email" required=""${attr("value", form.email)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div><label for="password" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.password"))}</label> <input id="password" type="password" autocomplete="new-password" required=""${attr("value", form.password)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div><label for="confirmPassword" class="block text-sm font-medium text-muted-foreground mb-2">Confirm Password</label> <input id="confirmPassword" type="password" autocomplete="new-password" required=""${attr("value", form.confirmPassword)} placeholder="Re-enter your password" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div></div></fieldset> <fieldset class="bg-muted p-6 rounded-lg shadow border border-border"><legend class="text-lg font-semibold mb-4 text-primary">Personal Information</legend> <p class="text-sm text-muted-foreground mb-4">This information will be used as your default sender details</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="fullName" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.fullName"))}</label> <input id="fullName" type="text" autocomplete="name" required=""${attr("value", form.fullName)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div><label for="phone" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.phone"))}</label> <input id="phone" type="tel" autocomplete="tel" required=""${attr("value", form.phone)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div class="md:col-span-2"><label for="country" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.country"))}</label> `);
		$$renderer.select({
			id: "country",
			required: true,
			value: form.country,
			class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`${escape_html(t("placeholders.selectCountry"))}`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(countries_default.countries);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let country = each_array[$$index];
				$$renderer.option({ value: country.name }, ($$renderer) => {
					$$renderer.push(`${escape_html(country.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div><label for="city" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.city"))}</label> <input id="city" type="text" required=""${attr("value", form.city)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div><label for="postalCode" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.postalCode"))}</label> <input id="postalCode" type="text" autocomplete="postal-code" required=""${attr("value", form.postalCode)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div> <div class="md:col-span-2"><label for="street" class="block text-sm font-medium text-muted-foreground mb-2">${escape_html(t("auth.street"))}</label> <input id="street" type="text" autocomplete="street-address" required=""${attr("value", form.street)} class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"/></div></div></fieldset> <button type="submit"${attr("disabled", loading, true)} class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-nord-polar-0 bg-primary hover:bg-nord-frost-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-nord-polar-3 disabled:cursor-not-allowed">${escape_html(t("auth.register"))}</button></form> <p class="text-center text-sm text-muted-foreground">${escape_html(t("auth.alreadyHaveAccount"))} <a href="/login" class="font-medium text-primary hover:text-nord-frost-3">${escape_html(t("auth.loginHere"))}</a></p></div></div>`);
	});
}
//#endregion
export { _page as default };
