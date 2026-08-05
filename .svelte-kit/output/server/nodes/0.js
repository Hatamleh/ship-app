import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.m_ElQocu.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/yuBekkrP.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BI8YM89o.js","_app/immutable/chunks/DFmY6E8B.js","_app/immutable/chunks/B7B0rgFt.js","_app/immutable/chunks/BYEjr_9R.js","_app/immutable/chunks/DWTF0gOf.js"];
export const stylesheets = ["_app/immutable/assets/Markdown.G9Uyiqso.css","_app/immutable/assets/0.BG3-BAZb.css"];
export const fonts = [];
