
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/agent" | "/api/agent/chat" | "/api/agent/health" | "/api/assistant" | "/api/assistant/ask" | "/api/assistant/search" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/register" | "/api/rates" | "/api/rules" | "/api/rules/additional-options" | "/api/rules/package" | "/api/rules/receiver" | "/api/rules/sender" | "/api/rules/service" | "/api/shipments" | "/api/shipments/draft" | "/api/shipments/finalize" | "/api/shipments/[id]" | "/api/shipments/[id]/finalize" | "/assistant" | "/login" | "/register" | "/shipments" | "/shipments/[id]";
		RouteParams(): {
			"/api/shipments/[id]": { id: string };
			"/api/shipments/[id]/finalize": { id: string };
			"/shipments/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined };
			"/api": { id?: string | undefined };
			"/api/agent": Record<string, never>;
			"/api/agent/chat": Record<string, never>;
			"/api/agent/health": Record<string, never>;
			"/api/assistant": Record<string, never>;
			"/api/assistant/ask": Record<string, never>;
			"/api/assistant/search": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/me": Record<string, never>;
			"/api/auth/register": Record<string, never>;
			"/api/rates": Record<string, never>;
			"/api/rules": Record<string, never>;
			"/api/rules/additional-options": Record<string, never>;
			"/api/rules/package": Record<string, never>;
			"/api/rules/receiver": Record<string, never>;
			"/api/rules/sender": Record<string, never>;
			"/api/rules/service": Record<string, never>;
			"/api/shipments": { id?: string | undefined };
			"/api/shipments/draft": Record<string, never>;
			"/api/shipments/finalize": Record<string, never>;
			"/api/shipments/[id]": { id: string };
			"/api/shipments/[id]/finalize": { id: string };
			"/assistant": Record<string, never>;
			"/login": Record<string, never>;
			"/register": Record<string, never>;
			"/shipments": { id?: string | undefined };
			"/shipments/[id]": { id: string }
		};
		Pathname(): "/" | "/api/agent/chat" | "/api/agent/health" | "/api/assistant/ask" | "/api/assistant/search" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/register" | "/api/rates" | "/api/rules/additional-options" | "/api/rules/package" | "/api/rules/receiver" | "/api/rules/sender" | "/api/rules/service" | "/api/shipments" | "/api/shipments/draft" | "/api/shipments/finalize" | `/api/shipments/${string}` & {} | `/api/shipments/${string}/finalize` & {} | "/assistant" | "/login" | "/register" | "/shipments" | `/shipments/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}