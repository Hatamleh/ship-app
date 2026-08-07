import * as server from '../entries/pages/shipments/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/shipments/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/shipments/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.ByrkQFqO.js","_app/immutable/chunks/DIVOnSqY.js","_app/immutable/chunks/Bsy2HlSg.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BEAHETjJ.js","_app/immutable/chunks/BAXidZTx.js","_app/immutable/chunks/PE-87nz7.js","_app/immutable/chunks/Ce6aGjJy.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = [];
export const fonts = [];
