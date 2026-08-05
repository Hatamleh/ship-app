import { E as attr, O as escape_html, s as head } from "../../../chunks/server.js";
import "../../../chunks/navigation.js";
import { t } from "../../../chunks/translations.js";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = "";
		let password = "";
		let loading = false;
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Log In - My Shipments</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-md w-full space-y-8"><div><img src="/ship-logo.svg" alt="ShipApp" class="mx-auto h-14 w-14"/> <h1 class="mt-6 text-center text-3xl font-extrabold text-foreground font-display">${escape_html(t("auth.loginTitle"))}</h1></div> <form class="mt-8 space-y-6">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="surface p-6 space-y-4"><div><label for="email" class="block text-sm font-medium text-muted-foreground">${escape_html(t("auth.email"))}</label> <input id="email" name="email" type="email" autocomplete="email" required=""${attr("value", email)}${attr("placeholder", t("placeholders.enterEmail"))} class="field mt-3"/></div> <div><label for="password" class="block text-sm font-medium text-muted-foreground">${escape_html(t("auth.password"))}</label> <input id="password" name="password" type="password" autocomplete="current-password" required=""${attr("value", password)}${attr("placeholder", t("placeholders.enterPassword"))} class="field mt-3"/></div></div> <button type="submit"${attr("disabled", loading, true)} class="btn btn-primary w-full">${escape_html(t("auth.login"))}</button></form> <p class="text-center text-sm text-muted-foreground">${escape_html(t("auth.dontHaveAccount"))} <a href="/register" class="font-medium text-primary hover:text-primary-hover">${escape_html(t("auth.registerHere"))}</a></p></div></div>`);
	});
}
//#endregion
export { _page as default };
