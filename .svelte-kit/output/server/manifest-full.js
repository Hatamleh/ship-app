export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.D2OdK8rH.js",app:"_app/immutable/entry/app.AHOApQR2.js",imports:["_app/immutable/entry/start.D2OdK8rH.js","_app/immutable/chunks/yazStQ0B.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/entry/app.AHOApQR2.js","_app/immutable/chunks/Ce_Ma__k.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/agent/chat",
				pattern: /^\/api\/agent\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/agent/chat/_server.ts.js'))
			},
			{
				id: "/api/agent/health",
				pattern: /^\/api\/agent\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/agent/health/_server.ts.js'))
			},
			{
				id: "/api/assistant/ask",
				pattern: /^\/api\/assistant\/ask\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/assistant/ask/_server.ts.js'))
			},
			{
				id: "/api/assistant/search",
				pattern: /^\/api\/assistant\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/assistant/search/_server.ts.js'))
			},
			{
				id: "/api/auth/login",
				pattern: /^\/api\/auth\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/login/_server.ts.js'))
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/logout/_server.ts.js'))
			},
			{
				id: "/api/auth/me",
				pattern: /^\/api\/auth\/me\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/me/_server.ts.js'))
			},
			{
				id: "/api/auth/register",
				pattern: /^\/api\/auth\/register\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/register/_server.ts.js'))
			},
			{
				id: "/api/rates",
				pattern: /^\/api\/rates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rates/_server.ts.js'))
			},
			{
				id: "/api/rules/additional-options",
				pattern: /^\/api\/rules\/additional-options\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rules/additional-options/_server.ts.js'))
			},
			{
				id: "/api/rules/package",
				pattern: /^\/api\/rules\/package\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rules/package/_server.ts.js'))
			},
			{
				id: "/api/rules/receiver",
				pattern: /^\/api\/rules\/receiver\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rules/receiver/_server.ts.js'))
			},
			{
				id: "/api/rules/sender",
				pattern: /^\/api\/rules\/sender\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rules/sender/_server.ts.js'))
			},
			{
				id: "/api/rules/service",
				pattern: /^\/api\/rules\/service\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/rules/service/_server.ts.js'))
			},
			{
				id: "/api/shipments",
				pattern: /^\/api\/shipments\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/shipments/_server.ts.js'))
			},
			{
				id: "/api/shipments/draft",
				pattern: /^\/api\/shipments\/draft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/shipments/draft/_server.ts.js'))
			},
			{
				id: "/api/shipments/finalize",
				pattern: /^\/api\/shipments\/finalize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/shipments/finalize/_server.ts.js'))
			},
			{
				id: "/api/shipments/[id]",
				pattern: /^\/api\/shipments\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/shipments/_id_/_server.ts.js'))
			},
			{
				id: "/api/shipments/[id]/finalize",
				pattern: /^\/api\/shipments\/([^/]+?)\/finalize\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/shipments/_id_/finalize/_server.ts.js'))
			},
			{
				id: "/assistant",
				pattern: /^\/assistant\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/shipments",
				pattern: /^\/shipments\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/shipments/[id]",
				pattern: /^\/shipments\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
