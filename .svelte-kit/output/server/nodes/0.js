import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BjjezLu-.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/jUgJoZ0J.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C6h_lhh4.js","_app/immutable/chunks/BIkLpYax.js","_app/immutable/chunks/B7B0rgFt.js","_app/immutable/chunks/Ck6OezI3.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = ["_app/immutable/assets/Markdown.F9wvZp3p.css","_app/immutable/assets/0.DOw2s8_n.css"];
export const fonts = [];
