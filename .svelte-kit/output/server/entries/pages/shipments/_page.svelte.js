import { E as attr, O as escape_html, d as slot, f as spread_props, i as derived, o as ensure_array_like, p as stringify, s as head, t as attr_class, u as sanitize_props } from "../../../chunks/server.js";
import { n as invalidateAll, t as goto } from "../../../chunks/client.js";
import { t as page } from "../../../chunks/state.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t } from "../../../chunks/translations.js";
//#region src/lib/components/shipments/StatsCards.svelte
function StatsCards($$renderer, $$props) {
	let { total, draft, finalized } = $$props;
	const stats = derived(() => [
		{
			label: "Total Shipments",
			value: total,
			tone: "text-foreground"
		},
		{
			label: "Draft",
			value: draft,
			tone: "text-muted-foreground"
		},
		{
			label: "Finalized",
			value: finalized,
			tone: "text-premium"
		}
	]);
	$$renderer.push(`<dl class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><!--[-->`);
	const each_array = ensure_array_like(stats());
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let stat = each_array[$$index];
		$$renderer.push(`<div class="bg-muted p-4 rounded-lg shadow border border-border"><dt class="text-sm text-muted-foreground">${escape_html(stat.label)}</dt> <dd${attr_class(`text-2xl font-bold ${stringify(stat.tone)}`)}>${escape_html(stat.value)}</dd></div>`);
	}
	$$renderer.push(`<!--]--></dl>`);
}
//#endregion
//#region src/lib/components/shipments/ShipmentFilters.svelte
function ShipmentFilters($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { statusFilter, typeFilter, onStatusChange, onTypeChange } = $$props;
		$$renderer.push(`<div class="bg-muted p-4 rounded-lg shadow border border-border mb-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="status-filter" class="block text-sm font-medium text-muted-foreground mb-1">Status</label> `);
		$$renderer.select({
			id: "status-filter",
			value: statusFilter,
			onchange: (e) => onStatusChange(e.currentTarget.value),
			class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Statuses`);
			});
			$$renderer.option({ value: "draft" }, ($$renderer) => {
				$$renderer.push(`Draft`);
			});
			$$renderer.option({ value: "finalized" }, ($$renderer) => {
				$$renderer.push(`Finalized`);
			});
		});
		$$renderer.push(`</div> <div><label for="type-filter" class="block text-sm font-medium text-muted-foreground mb-1">Type</label> `);
		$$renderer.select({
			id: "type-filter",
			value: typeFilter,
			onchange: (e) => onTypeChange(e.currentTarget.value),
			class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Types`);
			});
			$$renderer.option({ value: "Domestic" }, ($$renderer) => {
				$$renderer.push(`Domestic`);
			});
			$$renderer.option({ value: "IntraGulf" }, ($$renderer) => {
				$$renderer.push(`Intra-Gulf`);
			});
			$$renderer.option({ value: "International" }, ($$renderer) => {
				$$renderer.push(`International`);
			});
		});
		$$renderer.push(`</div></div></div>`);
	});
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/ellipsis-vertical.svelte
function Ellipsis_vertical($$renderer, $$props) {
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
		{ name: "ellipsis-vertical" },
		$$sanitized_props,
		{
			/**
			* @component @name EllipsisVertical
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iNSIgcj0iMSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE5IiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ellipsis-vertical
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["circle", {
					"cx": "12",
					"cy": "12",
					"r": "1"
				}],
				["circle", {
					"cx": "12",
					"cy": "5",
					"r": "1"
				}],
				["circle", {
					"cx": "12",
					"cy": "19",
					"r": "1"
				}]
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
//#region node_modules/lucide-svelte/dist/icons/eye.svelte
function Eye($$renderer, $$props) {
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
		{ name: "eye" },
		$$sanitized_props,
		{
			/**
			* @component @name Eye
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
				"cx": "12",
				"cy": "12",
				"r": "3"
			}]],
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
//#region node_modules/lucide-svelte/dist/icons/pencil.svelte
function Pencil($$renderer, $$props) {
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
		{ name: "pencil" },
		$$sanitized_props,
		{
			/**
			* @component @name Pencil
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]],
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
//#region node_modules/lucide-svelte/dist/icons/file-check.svelte
function File_check($$renderer, $$props) {
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
		{ name: "file-check" },
		$$sanitized_props,
		{
			/**
			* @component @name FileCheck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJtOSAxNSAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
				["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
				["path", { "d": "m9 15 2 2 4-4" }]
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
//#region node_modules/lucide-svelte/dist/icons/trash-2.svelte
function Trash_2($$renderer, $$props) {
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
		{ name: "trash-2" },
		$$sanitized_props,
		{
			/**
			* @component @name Trash2
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash-2
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M10 11v6" }],
				["path", { "d": "M14 11v6" }],
				["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
				["path", { "d": "M3 6h18" }],
				["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
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
//#region node_modules/lucide-svelte/dist/icons/repeat.svelte
function Repeat($$renderer, $$props) {
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
		{ name: "repeat" },
		$$sanitized_props,
		{
			/**
			* @component @name Repeat
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTcgMiA0IDQtNCA0IiAvPgogIDxwYXRoIGQ9Ik0zIDExdi0xYTQgNCAwIDAgMSA0LTRoMTQiIC8+CiAgPHBhdGggZD0ibTcgMjItNC00IDQtNCIgLz4KICA8cGF0aCBkPSJNMjEgMTN2MWE0IDQgMCAwIDEtNCA0SDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/repeat
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "m17 2 4 4-4 4" }],
				["path", { "d": "M3 11v-1a4 4 0 0 1 4-4h14" }],
				["path", { "d": "m7 22-4-4 4-4" }],
				["path", { "d": "M21 13v1a4 4 0 0 1-4 4H3" }]
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
//#region src/lib/components/shipments/ShipmentsTable.svelte
function ShipmentsTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { shipments, onDelete, onFinalize } = $$props;
		/**
		* Which row's action menu is open. The menu is rendered inline and positioned
		* with CSS, rather than measured and portalled as the React version did.
		*/
		let openMenuId = null;
		function label(shipment) {
			return shipment.status === "draft" ? `draft shipment ${shipment.id}` : shipment.trackingNumber;
		}
		if (shipments.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-12"><h2 class="mt-2 text-sm font-medium text-foreground">${escape_html(t("table.noShipments"))}</h2> <p class="mt-1 text-sm text-muted-foreground">${escape_html(t("table.createFirstShipment"))}</p> <div class="mt-6"><a href="/" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-nord-polar-0 bg-primary hover:bg-nord-frost-3">+ ${escape_html(t("table.createShipment"))}</a></div></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="rounded-lg border border-border overflow-x-auto"><table class="min-w-full divide-y divide-border"><caption class="sr-only">Your shipments</caption><thead class="bg-nord-polar-2"><tr><th scope="col" class="px-4 py-3 w-16"><span class="sr-only">Actions</span></th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">${escape_html(t("table.trackingNumber"))}</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sender</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Receiver</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">${escape_html(t("table.status"))}</th></tr></thead><tbody class="bg-muted divide-y divide-border"><!--[-->`);
			const each_array = ensure_array_like(shipments);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let shipment = each_array[$$index];
				$$renderer.push(`<tr class="hover:bg-nord-polar-2"><td class="px-4 py-4 whitespace-nowrap text-sm font-medium relative" data-menu-root=""><button type="button"${attr("aria-label", `Actions for ${stringify(label(shipment))}`)} aria-haspopup="menu"${attr("aria-expanded", openMenuId === shipment.id)} class="text-muted-foreground hover:text-primary p-1 rounded hover:bg-nord-polar-2">`);
				Ellipsis_vertical($$renderer, {
					class: "w-5 h-5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></button> `);
				if (openMenuId === shipment.id) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div role="menu"${attr("aria-label", `Actions for ${stringify(label(shipment))}`)} class="absolute left-0 top-full mt-1 z-20 w-48 bg-muted border border-border rounded-md shadow-lg py-1"><a role="menuitem"${attr("href", `/shipments/${stringify(shipment.id)}`)} class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors">`);
					Eye($$renderer, {
						class: "w-4 h-4",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> View</a> `);
					if (shipment.status === "draft") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<a role="menuitem"${attr("href", `/?edit=${stringify(shipment.id)}`)} class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors">`);
						Pencil($$renderer, {
							class: "w-4 h-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> Edit</a> <button role="menuitem" type="button" class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors">`);
						File_check($$renderer, {
							class: "w-4 h-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> Finalize Shipment</button>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<a role="menuitem"${attr("href", `/?repeat=${stringify(shipment.id)}`)} class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors">`);
						Repeat($$renderer, {
							class: "w-4 h-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> Repeat</a>`);
					}
					$$renderer.push(`<!--]--> <button role="menuitem" type="button" class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-nord-aurora-red/20 transition-colors">`);
					Trash_2($$renderer, {
						class: "w-4 h-4",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> Delete</button></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></td><th scope="row" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">${escape_html(shipment.status === "draft" ? "-" : shipment.trackingNumber)}</th><td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">${escape_html(shipment.from.name)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">${escape_html(shipment.to.name)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${escape_html(shipment.to.city)}, ${escape_html(shipment.to.country)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${escape_html(t(`shipmentTypes.${shipment.service.shipmentType}`))}</td><td class="px-6 py-4 whitespace-nowrap">`);
				if (shipment.status === "draft") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="px-2 py-1 text-xs font-medium rounded-full bg-nord-polar-2 text-muted-foreground">${escape_html(t("status.Draft"))}</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="px-2 py-1 text-xs font-medium rounded-full bg-nord-aurora-green/20 text-premium">Finalized</span>`);
				}
				$$renderer.push(`<!--]--></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/shipments/DeleteModal.svelte
function DeleteModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, shipmentId = null, onConfirm, onCancel } = $$props;
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" class="bg-muted rounded-lg shadow-xl max-w-md w-full mx-4 border border-border"><div class="p-6"><div class="flex items-center gap-4 mb-4"><div class="flex-shrink-0 w-12 h-12 bg-nord-aurora-red/20 rounded-full flex items-center justify-center">`);
			Trash_2($$renderer, {
				class: "w-6 h-6 text-destructive",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></div> <div><h2 id="delete-title" class="text-lg font-semibold text-foreground">Delete Shipment</h2> <p class="text-sm text-muted-foreground">Shipment #${escape_html(shipmentId)}</p></div></div> <p id="delete-description" class="text-muted-foreground mb-6">Are you sure you want to delete this shipment? This action cannot be undone.</p> <div class="flex gap-3 justify-end"><button type="button" class="px-4 py-2 text-sm font-medium text-muted-foreground bg-nord-polar-2 border border-border rounded-md hover:bg-nord-polar-3 transition-colors">Cancel</button> <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-nord-aurora-red/80 transition-colors">Delete</button></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/shipments/PromoModal.svelte
function PromoModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/shipments/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let deleteTarget = null;
		let errorMessage = null;
		let working = false;
		const showSuccess = derived(() => page.url.searchParams.get("success") === "true");
		const stats = derived(() => ({
			total: data.shipments.length,
			draft: data.shipments.filter((s) => s.status === "draft").length,
			finalized: data.shipments.filter((s) => s.status !== "draft").length
		}));
		/** Filters are URL state, so a filtered list is shareable and survives reload. */
		function setFilter(key, value) {
			const params = new URLSearchParams(page.url.searchParams);
			params.delete("success");
			if (value === "all") params.delete(key);
			else params.set(key, value);
			goto(`?${params}`, {
				keepFocus: true,
				noScroll: true
			});
		}
		async function confirmDelete() {
			if (deleteTarget === null) return;
			const id = deleteTarget;
			deleteTarget = null;
			working = true;
			try {
				if (!(await fetch(`/api/shipments/${id}`, { method: "DELETE" })).ok) {
					errorMessage = "Failed to delete shipment";
					return;
				}
				await invalidateAll();
			} finally {
				working = false;
			}
		}
		async function finalize(id) {
			working = true;
			errorMessage = null;
			try {
				const response = await fetch(`/api/shipments/${id}/finalize`, { method: "POST" });
				if (!response.ok) {
					const body = await response.json().catch(() => ({}));
					errorMessage = body.message || body.error || "Failed to finalize shipment";
					return;
				}
				await invalidateAll();
			} finally {
				working = false;
			}
		}
		head("1qq0ir0", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>My Shipments</title>`);
			});
		});
		PromoModal($$renderer, {});
		$$renderer.push(`<!----> <div class="mb-8 flex items-center justify-between"><div><h1 class="text-3xl font-bold text-foreground">My Shipments</h1> <p class="mt-2 text-muted-foreground">View and manage all your shipments</p></div> <a href="/" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nord-polar-0 bg-primary hover:bg-nord-frost-3">+ Create Shipment</a></div> `);
		if (showSuccess()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="status" class="mb-6 bg-nord-aurora-green/20 border border-premium text-premium px-4 py-3 rounded">Shipment saved successfully!</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (errorMessage) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="alert" class="mb-6 bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded">${escape_html(errorMessage)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		StatsCards($$renderer, {
			total: stats().total,
			draft: stats().draft,
			finalized: stats().finalized
		});
		$$renderer.push(`<!----> `);
		ShipmentFilters($$renderer, {
			statusFilter: data.status,
			typeFilter: data.shipmentType,
			onStatusChange: (v) => setFilter("status", v),
			onTypeChange: (v) => setFilter("type", v)
		});
		$$renderer.push(`<!----> <div${attr("aria-busy", working)}>`);
		ShipmentsTable($$renderer, {
			shipments: data.shipments,
			onDelete: (id) => deleteTarget = id,
			onFinalize: finalize
		});
		$$renderer.push(`<!----></div> `);
		DeleteModal($$renderer, {
			open: deleteTarget !== null,
			shipmentId: deleteTarget,
			onConfirm: confirmDelete,
			onCancel: () => deleteTarget = null
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };
