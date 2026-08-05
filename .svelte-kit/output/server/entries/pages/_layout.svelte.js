import { E as attr, O as escape_html, d as slot, f as spread_props, i as derived, o as ensure_array_like, t as attr_class, u as sanitize_props } from "../../chunks/server.js";
import { t as page } from "../../chunks/state.js";
import "../../chunks/navigation.js";
import { t as Icon } from "../../chunks/Icon.js";
import "../../chunks/Markdown.js";
import { t } from "../../chunks/translations.js";
//#region node_modules/lucide-svelte/dist/icons/bot.svelte
function Bot($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	/**
	* @license lucide-svelte v1.0.1 - ISC
	*
	* ISC License
	*
	* Copyright (c) 2026 Lucide Icons and Contributors
	*
	* Permission to use, copy, modify, and/or distribute this software for any
	* purpose with or without fee is hereby granted, provided that the above
	* copyright notice and this permission notice appear in all copies.
	*
	* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*
	* ---
	*
	* The following Lucide icons are derived from the Feather project:
	*
	* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
	*
	* The MIT License (MIT) (for the icons listed above)
	*
	* Copyright (c) 2013-present Cole Bemis
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in all
	* copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	* SOFTWARE.
	*
	*/
	Icon($$renderer, spread_props([
		{ name: "bot" },
		$$sanitized_props,
		{
			/**
			* @component @name Bot
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgOFY0SDgiIC8+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiB4PSI0IiB5PSI4IiByeD0iMiIgLz4KICA8cGF0aCBkPSJNMiAxNGgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxNGgyIiAvPgogIDxwYXRoIGQ9Ik0xNSAxM3YyIiAvPgogIDxwYXRoIGQ9Ik05IDEzdjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/bot
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M12 8V4H8" }],
				["rect", {
					"width": "16",
					"height": "12",
					"x": "4",
					"y": "8",
					"rx": "2"
				}],
				["path", { "d": "M2 14h2" }],
				["path", { "d": "M20 14h2" }],
				["path", { "d": "M15 13v2" }],
				["path", { "d": "M9 13v2" }]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/lib/components/agent/ChatDrawer.svelte
function ChatDrawer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<button type="button"${attr("aria-label", t("ai.openChat"))} class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-nord-polar-0 shadow-lg flex items-center justify-center hover:bg-nord-frost-3 transition-colors">`);
		Bot($$renderer, {
			class: "w-6 h-6",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		const PUBLIC_ROUTES = ["/login", "/register"];
		const isPublicRoute = derived(() => PUBLIC_ROUTES.includes(page.url.pathname));
		let loggingOut = false;
		const navItems = [
			{
				name: t("nav.createShipment"),
				href: "/"
			},
			{
				name: t("nav.myShipments"),
				href: "/shipments"
			},
			{
				name: "Assistant",
				href: "/assistant"
			}
		];
		if (isPublicRoute() || !data.user) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex h-screen bg-background"><aside class="w-64 bg-muted shadow-lg flex flex-col border-r border-border"><div class="p-6 border-b border-border"><div class="flex items-center gap-2"><svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> <span class="text-xl font-bold text-foreground">My Shipments</span></div></div> <div class="p-6 border-b border-border"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-nord-frost-1/20 rounded-full flex items-center justify-center"><span class="text-primary font-semibold text-sm" aria-hidden="true">${escape_html(data.user.fullName.charAt(0).toUpperCase())}</span></div> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground truncate">${escape_html(data.user.fullName)}</p> <p class="text-xs text-muted-foreground truncate">${escape_html(data.user.email)}</p></div></div></div> <nav aria-label="Main" class="flex-1 p-4 space-y-2"><!--[-->`);
			const each_array = ensure_array_like(navItems);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				const isActive = page.url.pathname === item.href;
				$$renderer.push(`<a${attr("href", item.href)}${attr("aria-current", isActive ? "page" : void 0)}${attr_class(`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-nord-frost-1/20 text-primary font-medium" : "text-muted-foreground hover:bg-nord-polar-2"}`)}>${escape_html(item.name)}</a>`);
			}
			$$renderer.push(`<!--]--></nav> <div class="p-4 border-t border-border"><button type="button"${attr("disabled", loggingOut, true)} class="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-nord-polar-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">${escape_html(t("nav.logout"))}</button></div></aside> <main class="flex-1 overflow-auto bg-background bg-grid-fade"><div class="p-8">`);
			children($$renderer);
			$$renderer.push(`<!----></div></main> `);
			ChatDrawer($$renderer, {});
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _layout as default };
