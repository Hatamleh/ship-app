import * as server from '../entries/pages/shipments/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shipments/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shipments/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.D2VQNcch.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/yuBekkrP.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BI8YM89o.js","_app/immutable/chunks/DFmY6E8B.js","_app/immutable/chunks/B7B0rgFt.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = [];
export const fonts = [];
