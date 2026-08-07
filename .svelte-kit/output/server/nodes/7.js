import * as server from '../entries/pages/shipments/_id_/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shipments/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shipments/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.DXrOwrMt.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/yazStQ0B.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/5l3L45eO.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = [];
export const fonts = [];
