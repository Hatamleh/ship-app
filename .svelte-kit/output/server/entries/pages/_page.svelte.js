import "../../chunks/internal.js";
import { D as clsx, E as attr, O as escape_html, d as slot, f as spread_props, i as derived, o as ensure_array_like, p as stringify, pt as run, s as head, t as attr_class, u as sanitize_props } from "../../chunks/server.js";
import "../../chunks/form-bridge.svelte.js";
import { t as goto } from "../../chunks/client.js";
import { t as page } from "../../chunks/state.js";
import "../../chunks/navigation.js";
import { t as Icon } from "../../chunks/Icon.js";
import { t } from "../../chunks/translations.js";
//#region node_modules/lucide-svelte/dist/icons/save.svelte
function Save($$renderer, $$props) {
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
		{ name: "save" },
		$$sanitized_props,
		{
			/**
			* @component @name Save
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" }],
				["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
				["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
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
//#region node_modules/lucide-svelte/dist/icons/circle-check-big.svelte
function Circle_check_big($$renderer, $$props) {
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
		{ name: "circle-check-big" },
		$$sanitized_props,
		{
			/**
			* @component @name CircleCheckBig
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuODAxIDEwQTEwIDEwIDAgMSAxIDE3IDMuMzM1IiAvPgogIDxwYXRoIGQ9Im05IDExIDMgM0wyMiA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check-big
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M21.801 10A10 10 0 1 1 17 3.335" }], ["path", { "d": "m9 11 3 3L22 4" }]],
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
//#region node_modules/lucide-svelte/dist/icons/user.svelte
function User($$renderer, $$props) {
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
		{ name: "user" },
		$$sanitized_props,
		{
			/**
			* @component @name User
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", {
				"cx": "12",
				"cy": "7",
				"r": "4"
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
//#region src/lib/components/cards/SenderCard.svelte
function SenderCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { formData } = $$props;
		$$renderer.push(`<section aria-labelledby="sender-heading" class="surface p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">`);
		User($$renderer, {
			class: "w-5 h-5 text-primary",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></div> <div class="flex-1"><h2 id="sender-heading" class="text-sm font-medium text-muted-foreground">${escape_html(t("form.senderInformation"))}</h2> <p class="text-foreground font-semibold">${escape_html(formData.senderName || "")} - ${escape_html(formData.senderCountry || "")}</p></div></div> <p class="text-xs text-muted-foreground/70 mt-3">Sender details are filled from your account automatically and cannot be edited</p></section>`);
	});
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/users.svelte
function Users($$renderer, $$props) {
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
		{ name: "users" },
		$$sanitized_props,
		{
			/**
			* @component @name Users
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8cGF0aCBkPSJNMTYgMy4xMjhhNCA0IDAgMCAxIDAgNy43NDQiIC8+CiAgPHBhdGggZD0iTTIyIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/users
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
				["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }],
				["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
				["circle", {
					"cx": "9",
					"cy": "7",
					"r": "4"
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
//#region node_modules/lucide-svelte/dist/icons/package.svelte
function Package($$renderer, $$props) {
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
		{ name: "package" },
		$$sanitized_props,
		{
			/**
			* @component @name Package
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjEuNzNhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M3oiIC8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxwYXRoIGQ9Im03LjUgNC4yNyA5IDUuMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/package
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" }],
				["path", { "d": "M12 22V12" }],
				["polyline", { "points": "3.29 7 12 12 20.71 7" }],
				["path", { "d": "m7.5 4.27 9 5.15" }]
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
//#region src/lib/components/DynamicCard.svelte
function DynamicCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Renders a form card from a rules payload served by /api/rules/*.
		*
		* Accessibility, since there are no test ids to fall back on:
		* - every control has a real <label for>, so getByLabel works
		* - required fields use aria-required plus a visible asterisk with an
		*   accessible "required" text alternative
		* - errors are wired with aria-describedby and announced via role="alert",
		*   and can be found with getByRole('alert')
		* - the card is a <fieldset> with a <legend>, so getByRole('group', { name })
		*   scopes queries to one card
		*/
		let { rules = null, formData, errors, onChange, onBlur, disabled = false, shipmentType, cardTitle } = $$props;
		const title = derived(() => rules?.title || cardTitle || "Loading...");
		const fieldEntries = derived(() => rules ? Object.entries(rules.fields).filter(([, f]) => f.visible !== false) : []);
		function inputClass(hasError, isDisabled) {
			return [
				"w-full px-3 py-2 border rounded-md bg-ever-surface text-foreground",
				"focus:outline-none focus:ring-2 focus:ring-primary",
				hasError ? "border-destructive" : "border-border",
				isDisabled ? "bg-ever-raised cursor-not-allowed opacity-50" : ""
			].join(" ");
		}
		function isFullWidth(name) {
			return name.includes("Street") || name.includes("Country") || name.includes("Description");
		}
		$$renderer.push(`<fieldset${attr_class(`surface p-6 ${disabled || !rules ? "opacity-50" : ""}`)}><legend class="flex w-full items-center justify-between gap-2 text-xl font-semibold text-primary"><span class="flex items-center gap-2">`);
		if (title().toLowerCase().includes("sender")) {
			$$renderer.push("<!--[0-->");
			User($$renderer, {
				class: "w-5 h-5",
				"aria-hidden": "true"
			});
		} else if (title().toLowerCase().includes("receiver")) {
			$$renderer.push("<!--[1-->");
			Users($$renderer, {
				class: "w-5 h-5",
				"aria-hidden": "true"
			});
		} else if (title().toLowerCase().includes("package")) {
			$$renderer.push("<!--[2-->");
			Package($$renderer, {
				class: "w-5 h-5",
				"aria-hidden": "true"
			});
		} else {
			$$renderer.push("<!--[-1-->");
			Circle_check_big($$renderer, {
				class: "w-5 h-5",
				"aria-hidden": "true"
			});
		}
		$$renderer.push(`<!--]--> ${escape_html(title())}</span> `);
		if (shipmentType) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="tag border-primary text-primary">${escape_html(shipmentType)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></legend> `);
		if (!rules) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground/70 text-center py-4">${escape_html(disabled ? t("form.completePreviousSection") : t("form.loadingCard"))}</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
			const each_array = ensure_array_like(fieldEntries());
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let [name, field] = each_array[$$index_1];
				const rule = field;
				const error = errors[name];
				const fieldDisabled = disabled || rule.disabled || false;
				const value = formData[name] ?? "";
				$$renderer.push(`<div${attr_class(clsx(isFullWidth(name) ? "md:col-span-2" : ""))}>`);
				if (rule.type === "checkbox") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center"><input type="checkbox"${attr("id", name)}${attr("name", name)}${attr("checked", !!formData[name], true)}${attr("disabled", fieldDisabled, true)} class="h-4 w-4 text-primary border-border rounded focus:ring-primary disabled:cursor-not-allowed"/> <label${attr("for", name)}${attr_class(`ml-2 text-sm ${fieldDisabled ? "text-muted-foreground/50" : "text-muted-foreground"}`)}>${escape_html(rule.label)}</label></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<label${attr("for", name)} class="block text-sm font-medium text-muted-foreground mb-3">${escape_html(rule.label)} `);
					if (rule.required) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-destructive" aria-hidden="true">*</span> <span class="sr-only">(required)</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (rule.type === "number" && rule.validation?.max) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="ml-2 text-xs text-muted-foreground/70">(Max: ${escape_html(rule.validation.max)})</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></label> `);
					if (rule.type === "select") {
						$$renderer.push("<!--[0-->");
						$$renderer.select({
							id: name,
							name,
							value,
							onchange: (e) => onChange(name, e.currentTarget.value),
							onblur: () => onBlur?.(name),
							disabled: fieldDisabled,
							class: inputClass(!!error, fieldDisabled),
							"aria-required": rule.required || void 0,
							"aria-invalid": error ? "true" : void 0,
							"aria-describedby": error ? `${name}-error` : void 0
						}, ($$renderer) => {
							$$renderer.option({ value: "" }, ($$renderer) => {
								$$renderer.push(`${escape_html(rule.placeholder || "Select...")}`);
							});
							$$renderer.push(`<!--[-->`);
							const each_array_1 = ensure_array_like(rule.options ?? []);
							for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
								let option = each_array_1[$$index];
								$$renderer.option({ value: option.value }, ($$renderer) => {
									$$renderer.push(`${escape_html(option.label)}`);
								});
							}
							$$renderer.push(`<!--]-->`);
						});
					} else if (rule.type === "number") {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<input type="number"${attr("id", name)}${attr("name", name)}${attr("value", value)}${attr("placeholder", rule.placeholder)}${attr("min", rule.validation?.min)}${attr("max", rule.validation?.max)} step="0.1"${attr("disabled", fieldDisabled, true)}${attr_class(clsx(inputClass(!!error, fieldDisabled)))}${attr("aria-required", rule.required || void 0)}${attr("aria-invalid", error ? "true" : void 0)}${attr("aria-describedby", error ? `${name}-error` : void 0)}/>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<input type="text"${attr("id", name)}${attr("name", name)}${attr("value", value)}${attr("placeholder", rule.placeholder)}${attr("disabled", fieldDisabled, true)}${attr_class(clsx(inputClass(!!error, fieldDisabled)))}${attr("aria-required", rule.required || void 0)}${attr("aria-invalid", error ? "true" : void 0)}${attr("aria-describedby", error ? `${name}-error` : void 0)}/>`);
					}
					$$renderer.push(`<!--]--> `);
					if (error) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p${attr("id", `${stringify(name)}-error`)} role="alert" class="mt-1 text-sm text-destructive">${escape_html(error)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></fieldset>`);
	});
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/truck.svelte
function Truck($$renderer, $$props) {
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
		{ name: "truck" },
		$$sanitized_props,
		{
			/**
			* @component @name Truck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiIC8+CiAgPHBhdGggZD0iTTE1IDE4SDkiIC8+CiAgPHBhdGggZD0iTTE5IDE4aDJhMSAxIDAgMCAwIDEtMXYtMy42NWExIDEgMCAwIDAtLjIyLS42MjRsLTMuNDgtNC4zNUExIDEgMCAwIDAgMTcuNTIgOEgxNCIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE4IiByPSIyIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSIxOCIgcj0iMiIgLz4KPC9zdmc+) - https://lucide.dev/icons/truck
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" }],
				["path", { "d": "M15 18H9" }],
				["path", { "d": "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" }],
				["circle", {
					"cx": "17",
					"cy": "18",
					"r": "2"
				}],
				["circle", {
					"cx": "7",
					"cy": "18",
					"r": "2"
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
//#region src/lib/components/cards/ServiceSelectionCard.svelte
function ServiceSelectionCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { serviceRules = null, selectedService = null, onServiceSelect, disabled = false } = $$props;
		$$renderer.push(`<fieldset${attr_class(`surface p-6 ${disabled || !serviceRules ? "opacity-50" : ""}`)}><legend class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">`);
		Truck($$renderer, {
			class: "w-5 h-5",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> ${escape_html(t("form.serviceSelection"))}</legend> `);
		if (!serviceRules) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground/70 text-center py-4">${escape_html(disabled ? t("form.completePreviousSection") : t("form.loadingServices"))}</p>`);
		} else if (serviceRules.services?.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<p role="status" class="text-sm text-muted-foreground/70 text-center py-4">No service can carry this package. Reduce the weight to see options.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(serviceRules.services ?? []);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let service = each_array[$$index];
				const checked = selectedService?.id === service.id;
				$$renderer.push(`<label${attr_class(`block p-4 border-2 rounded-lg transition-all cursor-pointer ${checked ? "border-primary bg-primary/20" : "border-border hover:border-primary/50"} ${disabled ? "cursor-not-allowed" : ""}`)}><div class="flex items-start gap-3"><input type="radio" name="serviceType"${attr("value", service.id)}${attr("checked", checked, true)}${attr("disabled", disabled, true)} class="mt-1 h-4 w-4 text-primary border-border focus:ring-primary disabled:cursor-not-allowed"/> <div class="flex-1"><div class="flex justify-between items-center mb-1"><span class="font-semibold text-foreground">${escape_html(service.name)}</span> <span class="text-sm text-muted-foreground">${escape_html(service.deliveryDays)}
                  ${escape_html(service.deliveryDays === 1 ? t("rate.day") : t("rate.days"))}</span></div> <p class="text-sm text-muted-foreground mb-2">${escape_html(service.description)}</p> <div class="text-xs text-muted-foreground/70">${escape_html(t("rate.base"))}: $${escape_html(service.basePrice)} + $${escape_html(service.pricePerKg)}/kg</div></div></div></label>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></fieldset>`);
	});
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/settings.svelte
function Settings($$renderer, $$props) {
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
		{ name: "settings" },
		$$sanitized_props,
		{
			/**
			* @component @name Settings
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOS42NzEgNC4xMzZhMi4zNCAyLjM0IDAgMCAxIDQuNjU5IDAgMi4zNCAyLjM0IDAgMCAwIDMuMzE5IDEuOTE1IDIuMzQgMi4zNCAwIDAgMSAyLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMCAwIDMuODMxIDIuMzQgMi4zNCAwIDAgMS0yLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMC0zLjMxOSAxLjkxNSAyLjM0IDIuMzQgMCAwIDEtNC42NTkgMCAyLjM0IDIuMzQgMCAwIDAtMy4zMi0xLjkxNSAyLjM0IDIuMzQgMCAwIDEtMi4zMy00LjAzMyAyLjM0IDIuMzQgMCAwIDAgMC0zLjgzMUEyLjM0IDIuMzQgMCAwIDEgNi4zNSA2LjA1MWEyLjM0IDIuMzQgMCAwIDAgMy4zMTktMS45MTUiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/settings
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", {
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
//#region src/lib/components/cards/AdditionalOptionsCard.svelte
function AdditionalOptionsCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { rules = null, formData, onChange, disabled = false } = $$props;
		const checkboxes = derived(() => [
			"signatureRequired",
			"containsLiquid",
			"insurance",
			"packaging"
		].map((name) => ({
			name,
			field: rules?.fields?.[name]
		})).filter((entry) => entry.field));
		const pickupField = derived(() => rules?.fields?.pickupMethod);
		$$renderer.push(`<fieldset${attr_class(`surface p-6 ${disabled || !rules ? "opacity-50" : ""}`)}><legend class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">`);
		Settings($$renderer, {
			class: "w-5 h-5",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> ${escape_html(rules?.title || t("form.additionalOptions"))}</legend> `);
		if (!rules) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground/70 text-center py-4">${escape_html(disabled ? t("form.completePreviousSection") : t("form.loadingOptions"))}</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(checkboxes());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let { name, field } = each_array[$$index];
				const isDisabled = disabled || field.disabled;
				$$renderer.push(`<div class="flex items-center gap-3"><input type="checkbox"${attr("id", name)}${attr("checked", !!formData[name], true)}${attr("disabled", isDisabled, true)}${attr("aria-describedby", field.disabled ? `${name}-forced` : void 0)} class="h-4 w-4 text-primary border-border rounded focus:ring-primary disabled:cursor-not-allowed"/> <label${attr("for", name)}${attr_class(`text-sm ${isDisabled ? "text-muted-foreground/50" : "text-muted-foreground"}`)}>${escape_html(field.label)}</label> `);
				if (field.disabled) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr("id", `${stringify(name)}-forced`)} class="text-xs text-primary">Required for this destination</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (pickupField()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<fieldset class="pt-3 border-t border-border"><legend class="block text-sm font-medium text-muted-foreground mb-3">${escape_html(pickupField().label)}</legend> <div class="space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(pickupField().options ?? []);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let option = each_array_1[$$index_1];
					const optionDisabled = disabled || (pickupField().disabledValues ?? []).includes(option.value);
					$$renderer.push(`<div class="flex items-center gap-3"><input type="radio"${attr("id", `pickup-${stringify(option.value)}`)} name="pickupMethod"${attr("value", option.value)}${attr("checked", formData.pickupMethod === option.value, true)}${attr("disabled", optionDisabled, true)}${attr("aria-describedby", optionDisabled ? `pickup-${option.value}-why` : void 0)} class="h-4 w-4 text-primary border-border focus:ring-primary disabled:cursor-not-allowed"/> <label${attr("for", `pickup-${stringify(option.value)}`)}${attr_class(`text-sm ${optionDisabled ? "text-muted-foreground/50" : "text-muted-foreground"}`)}>${escape_html(option.label)}</label> `);
					if (optionDisabled) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span${attr("id", `pickup-${stringify(option.value)}-why`)} class="text-xs text-muted-foreground/70">Unavailable for this package</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--></div></fieldset>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></fieldset>`);
	});
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/dollar-sign.svelte
function Dollar_sign($$renderer, $$props) {
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
		{ name: "dollar-sign" },
		$$sanitized_props,
		{
			/**
			* @component @name DollarSign
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMiIgLz4KICA8cGF0aCBkPSJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dollar-sign
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["line", {
				"x1": "12",
				"x2": "12",
				"y1": "2",
				"y2": "22"
			}], ["path", { "d": "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }]],
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
//#region src/lib/components/cards/RateCard.svelte
function RateCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { calculatedPrice = null, rateBreakdown = null, disabled = false } = $$props;
		const lines = derived(() => rateBreakdown ? [
			{
				label: t("rate.signatureRequired"),
				value: rateBreakdown.signatureCost
			},
			{
				label: t("rate.insurance"),
				value: rateBreakdown.insuranceCost
			},
			{
				label: t("rate.packaging"),
				value: rateBreakdown.packagingCost
			},
			{
				label: t("rate.liquidHandling"),
				value: rateBreakdown.liquidCost
			}
		].filter((line) => line.value > 0) : []);
		$$renderer.push(`<section aria-labelledby="rate-heading"${attr_class(`surface p-6 ${disabled || calculatedPrice === null ? "opacity-50" : ""}`)}><h2 id="rate-heading" class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">`);
		Dollar_sign($$renderer, {
			class: "w-5 h-5",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> ${escape_html(t("form.rate"))}</h2> <div class="space-y-4"><div class="flex justify-between items-center py-3 border-t border-b border-border"><span id="total-price-label" class="text-lg font-medium text-muted-foreground">${escape_html(t("rate.totalPrice"))}</span> <output aria-labelledby="total-price-label" aria-live="polite" class="text-2xl font-bold text-primary">${escape_html(calculatedPrice !== null ? `$${calculatedPrice.toFixed(2)}` : "-")}</output></div> `);
		if (rateBreakdown) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<dl class="space-y-2 text-sm"><div class="flex justify-between text-muted-foreground"><dt>${escape_html(t("rate.baseShippingCost"))}</dt> <dd>$${escape_html(rateBreakdown.baseCost.toFixed(2))}</dd></div> <!--[-->`);
			const each_array = ensure_array_like(lines());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let line = each_array[$$index];
				$$renderer.push(`<div class="flex justify-between text-muted-foreground"><dt>${escape_html(line.label)}</dt> <dd>$${escape_html(line.value.toFixed(2))}</dd></div>`);
			}
			$$renderer.push(`<!--]--></dl>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (calculatedPrice === null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground/70 text-center py-4">${escape_html(disabled ? t("form.completePreviousSection") : t("form.selectServiceToSeePricing"))}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></section>`);
	});
}
//#endregion
//#region src/lib/state/shipment-form.svelte.ts
var EMPTY_FORM = {
	senderName: "",
	senderPhone: "",
	senderCountry: "",
	senderCity: "",
	senderStreet: "",
	senderPostalCode: "",
	receiverName: "",
	receiverPhone: "",
	receiverCountry: "",
	receiverCity: "",
	receiverStreet: "",
	receiverPostalCode: "",
	weight: "",
	length: "",
	width: "",
	height: "",
	itemDescription: "",
	serviceType: "",
	signatureRequired: false,
	containsLiquid: false,
	insurance: false,
	packaging: false,
	pickupMethod: "home"
};
async function postJson(url, body) {
	return (await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})).json();
}
/** A card counts as complete when every required field it declares has a value. */
function cardComplete(rules, data) {
	if (!rules?.fields) return false;
	return Object.entries(rules.fields).every(([name, field]) => {
		if (!field.required) return true;
		const value = data[name];
		if (typeof value === "string") return value.trim().length > 0;
		return value !== null && value !== void 0 && value !== "";
	});
}
var ShipmentForm = class {
	form = { ...EMPTY_FORM };
	errors = {};
	loading = false;
	submitError = null;
	senderRules = null;
	receiverRules = null;
	packageRules = null;
	serviceRules = null;
	additionalOptionsRules = null;
	shipmentType = null;
	selectedService = null;
	calculatedPrice = null;
	rateBreakdown = null;
	isEditMode;
	shipmentId;
	#hydrating = false;
	#senderCompleted = derived(() => cardComplete(this.senderRules, this.form));
	get senderCompleted() {
		return this.#senderCompleted();
	}
	set senderCompleted($$value) {
		return this.#senderCompleted($$value);
	}
	#receiverCompleted = derived(() => this.senderCompleted && cardComplete(this.receiverRules, this.form) && Object.keys(this.receiverRules?.validationErrors ?? {}).length === 0);
	get receiverCompleted() {
		return this.#receiverCompleted();
	}
	set receiverCompleted($$value) {
		return this.#receiverCompleted($$value);
	}
	#packageCompleted = derived(() => this.receiverCompleted && cardComplete(this.packageRules, this.form) && [
		"weight",
		"length",
		"width",
		"height"
	].every((f) => {
		const n = parseFloat(this.form[f]);
		return !isNaN(n) && n > 0;
	}));
	get packageCompleted() {
		return this.#packageCompleted();
	}
	set packageCompleted($$value) {
		return this.#packageCompleted($$value);
	}
	constructor(user, editId, repeatId) {
		this.isEditMode = !!editId;
		this.shipmentId = editId ? parseInt(editId) : repeatId ? parseInt(repeatId) : null;
		if (user && !this.shipmentId) Object.assign(this.form, {
			senderName: user.fullName,
			senderPhone: user.phone,
			senderCountry: user.country,
			senderCity: user.city,
			senderStreet: user.street,
			senderPostalCode: user.postalCode
		});
		if (this.shipmentId) {
			this.#hydrating = true;
			this.#loadShipment();
		}
	}
	async #loadShipment() {
		try {
			const response = await fetch(`/api/shipments/${this.shipmentId}`);
			if (!response.ok) {
				this.errors = { general: response.status === 404 ? "Shipment not found" : "Failed to load shipment" };
				return;
			}
			const { shipment } = await response.json();
			Object.assign(this.form, {
				senderName: shipment.from?.name ?? "",
				senderPhone: shipment.from?.phone ?? "",
				senderCountry: shipment.from?.country ?? "",
				senderCity: shipment.from?.city ?? "",
				senderStreet: shipment.from?.street ?? "",
				senderPostalCode: shipment.from?.postalCode ?? "",
				receiverName: shipment.to?.name ?? "",
				receiverPhone: shipment.to?.phone ?? "",
				receiverCountry: shipment.to?.country ?? "",
				receiverCity: shipment.to?.city ?? "",
				receiverStreet: shipment.to?.street ?? "",
				receiverPostalCode: shipment.to?.postalCode ?? "",
				weight: shipment.package?.weight?.toString() ?? "",
				length: shipment.package?.length?.toString() ?? "",
				width: shipment.package?.width?.toString() ?? "",
				height: shipment.package?.height?.toString() ?? "",
				itemDescription: shipment.package?.description ?? "",
				serviceType: shipment.service?.type ?? "",
				pickupMethod: shipment.service?.pickupMethod ?? "home",
				signatureRequired: shipment.options?.signature ?? false,
				containsLiquid: shipment.options?.liquid ?? false,
				insurance: shipment.options?.insurance ?? false,
				packaging: shipment.options?.packaging ?? false
			});
		} catch (err) {
			console.error("Error loading shipment:", err);
			this.errors = { general: "Failed to load shipment" };
		} finally {
			this.#hydrating = false;
		}
	}
	async #loadSenderRules(country) {
		try {
			this.senderRules = await postJson("/api/rules/sender", { from: { country } });
		} catch (err) {
			console.error("Error loading sender rules:", err);
		}
	}
	async #loadReceiverRules(from, to) {
		try {
			const rules = await postJson("/api/rules/receiver", {
				from: { country: from },
				to: { country: to }
			});
			this.receiverRules = rules;
			const violations = rules.validationErrors ?? {};
			const next = { ...this.errors };
			delete next.receiverCountry;
			this.errors = {
				...next,
				...violations
			};
		} catch (err) {
			console.error("Error loading receiver rules:", err);
		}
	}
	async #loadPackageRules(from, to) {
		try {
			const rules = await postJson("/api/rules/package", {
				from: { country: from },
				to: { country: to }
			});
			this.packageRules = rules;
			this.shipmentType = rules.shipmentType;
		} catch (err) {
			console.error("Error loading package rules:", err);
		}
	}
	async #loadServiceRules(shipmentType, weight) {
		try {
			const rules = await postJson("/api/rules/service", {
				shipmentType,
				package: { weight }
			});
			this.serviceRules = rules;
			if (this.shipmentId && this.form.serviceType && !this.selectedService) {
				const match = rules.services?.find((s) => s.id === this.form.serviceType);
				if (match) this.selectedService = match;
			}
			if (this.selectedService && !rules.services?.some((s) => s.id === this.selectedService.id)) {
				this.selectedService = null;
				this.form.serviceType = "";
			}
		} catch (err) {
			console.error("Error loading service rules:", err);
		}
	}
	async #loadAdditionalOptions(from, to, weight) {
		try {
			const rules = await postJson("/api/rules/additional-options", {
				from: { country: from },
				to: { country: to },
				package: { weight }
			});
			this.additionalOptionsRules = rules;
			if (rules.fields?.signatureRequired?.checked) this.form.signatureRequired = true;
			const pickup = rules.fields?.pickupMethod;
			if (pickup?.disabledValues?.includes(this.form.pickupMethod)) this.form.pickupMethod = pickup.defaultValue;
		} catch (err) {
			console.error("Error loading additional options rules:", err);
		}
	}
	async #loadRate(service, inputs) {
		try {
			const response = await fetch("/api/rates", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					serviceId: service.id,
					...inputs,
					weight: parseFloat(inputs.weight)
				})
			});
			if (!response.ok) {
				this.calculatedPrice = null;
				this.rateBreakdown = null;
				return;
			}
			const data = await response.json();
			this.calculatedPrice = data.totalPrice;
			this.rateBreakdown = data.breakdown;
		} catch (err) {
			console.error("Error calculating rate:", err);
			this.calculatedPrice = null;
			this.rateBreakdown = null;
		}
	}
	setField(name, value) {
		this.form[name] = value;
		if (this.errors[name]) {
			const next = { ...this.errors };
			delete next[name];
			this.errors = next;
		}
	}
	validateField(name, rule, value) {
		if (rule.required) {
			if (value === null || value === void 0 || value === "") return rule.validation?.errorMessage || "This field is required";
			if (typeof value === "string" && value.trim() === "") return rule.validation?.errorMessage || "This field is required";
		}
		const isPhone = name.toLowerCase().includes("phone");
		const length = isPhone && value ? String(value).replace(/\D/g, "").length : String(value ?? "").length;
		if (rule.validation?.minLength && value && length < rule.validation.minLength) return isPhone ? `Phone number must be at least ${rule.validation.minLength} digits` : `Minimum ${rule.validation.minLength} characters`;
		if (rule.validation?.maxLength && value && length > rule.validation.maxLength) return isPhone ? `Phone number cannot exceed ${rule.validation.maxLength} digits` : `Maximum ${rule.validation.maxLength} characters`;
		if (rule.validation?.pattern && value && !new RegExp(rule.validation.pattern).test(value)) return rule.validation?.errorMessage || "Invalid format";
		if (rule.type === "number" && value !== "" && value !== null && value !== void 0) {
			const num = parseFloat(value);
			if (isNaN(num)) return "Please enter a valid number";
			if (rule.validation?.min !== void 0 && num < rule.validation.min) return `Value must be at least ${rule.validation.min}`;
			if (rule.validation?.max !== void 0 && num > rule.validation.max) return `Value cannot exceed ${rule.validation.max}`;
		}
		return null;
	}
	blurField(name) {
		const rule = {
			...this.senderRules?.fields ?? {},
			...this.receiverRules?.fields ?? {},
			...this.packageRules?.fields ?? {}
		}[name];
		if (!rule) return;
		const error = this.validateField(name, rule, this.form[name]);
		if (error) {
			this.errors = {
				...this.errors,
				[name]: error
			};
			return;
		}
		if (this.receiverRules?.validationErrors?.[name]) return;
		const next = { ...this.errors };
		delete next[name];
		this.errors = next;
	}
	selectService(service) {
		this.selectedService = service;
		this.form.serviceType = service.id;
	}
	#validateAll() {
		const errors = {};
		for (const rules of [this.senderRules, this.receiverRules]) for (const [name, field] of Object.entries(rules?.fields ?? {})) if (field.required && !this.form[name]) errors[name] = field.validation?.errorMessage || "Required";
		Object.assign(errors, this.receiverRules?.validationErrors ?? {});
		if (this.packageRules) {
			const weight = parseFloat(this.form.weight);
			if (isNaN(weight) || weight <= 0) errors.weight = "Weight is required";
			else if (weight > this.packageRules.maxWeight) errors.weight = `Weight cannot exceed ${this.packageRules.maxWeight} kg`;
		}
		if (!this.selectedService) errors.service = "Please select a service";
		this.errors = errors;
		return Object.keys(errors).length === 0;
	}
	#payload() {
		return {
			from: {
				name: this.form.senderName,
				phone: this.form.senderPhone,
				country: this.form.senderCountry,
				city: this.form.senderCity,
				street: this.form.senderStreet,
				postalCode: this.form.senderPostalCode
			},
			to: {
				name: this.form.receiverName,
				phone: this.form.receiverPhone,
				country: this.form.receiverCountry,
				city: this.form.receiverCity,
				street: this.form.receiverStreet,
				postalCode: this.form.receiverPostalCode
			},
			package: {
				weight: parseFloat(this.form.weight) || 0,
				length: parseFloat(this.form.length) || 0,
				width: parseFloat(this.form.width) || 0,
				height: parseFloat(this.form.height) || 0,
				description: this.form.itemDescription || ""
			},
			service: {
				type: this.form.serviceType,
				pickupMethod: this.form.pickupMethod,
				shipmentType: this.shipmentType || "Domestic"
			},
			additional: {
				signature: this.form.signatureRequired,
				liquid: this.form.containsLiquid,
				insurance: this.form.insurance,
				packaging: this.form.packaging
			},
			rates: {
				base: this.rateBreakdown?.baseCost || 0,
				insurance: this.rateBreakdown?.insuranceCost || 0,
				signature: this.rateBreakdown?.signatureCost || 0,
				packaging: this.rateBreakdown?.packagingCost || 0,
				total: this.calculatedPrice || 0
			}
		};
	}
	async submit(isDraft) {
		if (!isDraft && !this.#validateAll()) return;
		this.loading = true;
		this.submitError = null;
		try {
			const editing = this.isEditMode && this.shipmentId;
			const url = editing ? `/api/shipments/${this.shipmentId}` : isDraft ? "/api/shipments/draft" : "/api/shipments/finalize";
			const response = await fetch(url, {
				method: editing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(this.#payload())
			});
			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				if (error.validationErrors && typeof error.validationErrors === "object") {
					this.errors = error.validationErrors;
					this.submitError = error.message || "Please correct the errors in the form";
					return;
				}
				this.submitError = error.details || error.error || `Failed to ${editing ? "update" : "create"} shipment`;
				return;
			}
			await goto("/shipments?success=true");
		} catch (err) {
			console.error("Error submitting shipment:", err);
			this.submitError = err instanceof Error ? err.message : "Something went wrong";
		} finally {
			this.loading = false;
		}
	}
};
//#endregion
//#region src/lib/components/ShipmentForm.svelte
function ShipmentForm_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, editId = null, repeatId = null } = $$props;
		const state = run(() => new ShipmentForm(user, editId, repeatId));
		$$renderer.push(`<form class="max-w-7xl mx-auto">`);
		if (state.submitError) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="alert" class="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-8">${escape_html(state.submitError)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (state.errors.general) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div role="alert" class="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-8">${escape_html(state.errors.general)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8"><div class="lg:col-span-3 space-y-6">`);
		SenderCard($$renderer, { formData: state.form });
		$$renderer.push(`<!----> `);
		DynamicCard($$renderer, {
			rules: state.receiverRules,
			formData: state.form,
			errors: state.errors,
			onChange: (n, v) => state.setField(n, v),
			onBlur: (n) => state.blurField(n),
			disabled: !state.senderCompleted,
			cardTitle: t("form.receiverInformation")
		});
		$$renderer.push(`<!----> `);
		DynamicCard($$renderer, {
			rules: state.packageRules,
			formData: state.form,
			errors: state.errors,
			onChange: (n, v) => state.setField(n, v),
			onBlur: (n) => state.blurField(n),
			disabled: !state.receiverCompleted,
			shipmentType: state.shipmentType,
			cardTitle: t("form.packageDetails")
		});
		$$renderer.push(`<!----></div> <div class="lg:col-span-2 space-y-6">`);
		ServiceSelectionCard($$renderer, {
			serviceRules: state.serviceRules,
			selectedService: state.selectedService,
			onServiceSelect: (s) => state.selectService(s),
			disabled: !state.packageCompleted
		});
		$$renderer.push(`<!----> `);
		if (state.errors.service) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p role="alert" class="text-sm text-destructive">${escape_html(state.errors.service)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		AdditionalOptionsCard($$renderer, {
			rules: state.additionalOptionsRules,
			formData: state.form,
			onChange: (n, v) => state.setField(n, v),
			disabled: !state.packageCompleted
		});
		$$renderer.push(`<!----> `);
		RateCard($$renderer, {
			calculatedPrice: state.calculatedPrice,
			rateBreakdown: state.rateBreakdown,
			disabled: !state.packageCompleted
		});
		$$renderer.push(`<!----></div></div> <div class="flex justify-end gap-4"><button type="button"${attr("disabled", state.loading, true)} class="btn">`);
		Save($$renderer, {
			class: "w-4 h-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> ${escape_html(state.loading ? t("form.saving") : t("form.saveDraft"))}</button> <button type="submit"${attr("disabled", state.loading, true)} class="btn btn-primary">`);
		Circle_check_big($$renderer, {
			class: "w-4 h-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> ${escape_html(state.loading ? t("form.finalizing") : t("form.finalizeShipment"))}</button></div></form>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const editId = derived(() => page.url.searchParams.get("edit"));
		const repeatId = derived(() => page.url.searchParams.get("repeat"));
		const heading = derived(() => editId() ? "Edit Shipment" : repeatId() ? "Repeat Shipment" : "Create a New Shipment");
		const description = derived(() => editId() ? "Update the shipment details below" : repeatId() ? "Review and edit the shipment details below" : "Fill in the shipment details below");
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(heading())} - My Shipments</title>`);
			});
		});
		$$renderer.push(`<div class="mb-8"><p class="eyebrow">${escape_html(editId() ? "Editing" : repeatId() ? "Repeating" : "New shipment")}</p> <h1 class="text-3xl font-bold text-foreground mb-2">${escape_html(heading().split(" ").slice(0, -1).join(" "))} <span class="grad">${escape_html(heading().split(" ").slice(-1))}</span></h1> <p class="text-muted-foreground">${escape_html(description())}</p></div> <!---->`);
		ShipmentForm_1($$renderer, {
			user: data.user,
			editId: editId(),
			repeatId: repeatId()
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };
