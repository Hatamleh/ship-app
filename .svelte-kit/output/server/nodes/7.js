import * as server from '../entries/pages/shipments/_id_/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shipments/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shipments/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.10I1t_jP.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/B9OLAHAB.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C_oe7vN4.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = [];
export const fonts = [];
