
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const DATABASE_URL: string;
	export const ENCRYPTION_KEY: string;
	export const JWT_SECRET: string;
	export const NEXT_PUBLIC_TEST_MODE: string;
	export const OPENROUTER_API_KEY: string;
	export const OPENROUTER_EMBEDDING_MODEL: string;
	export const OPENROUTER_MODEL: string;
	export const COLORTERM: string;
	export const OSLogRateLimit: string;
	export const npm_config_user_agent: string;
	export const GHOSTTY_BIN_DIR: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const XDG_DATA_DIRS: string;
	export const INFOPATH: string;
	export const OSTYPE: string;
	export const npm_config_prefix: string;
	export const SHLVL: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_config_npm_version: string;
	export const LANG: string;
	export const POSH_SHELL_VERSION: string;
	export const EDITOR: string;
	export const npm_lifecycle_event: string;
	export const TERMINFO: string;
	export const XPC_FLAGS: string;
	export const npm_command: string;
	export const CLAUDE_CODE_SESSION_ID: string;
	export const GHOSTTY_SHELL_FEATURES: string;
	export const SVELTEKIT_FORK: string;
	export const npm_node_execpath: string;
	export const _: string;
	export const npm_package_json: string;
	export const PATH: string;
	export const npm_config_userconfig: string;
	export const npm_execpath: string;
	export const LSCOLORS: string;
	export const PAGER: string;
	export const npm_package_version: string;
	export const VIRTUAL_ENV_DISABLE_PROMPT: string;
	export const HOMEBREW_CELLAR: string;
	export const PYENV_VIRTUALENV_DISABLE_PROMPT: string;
	export const SECURITYSESSIONID: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_config_globalconfig: string;
	export const ZLE_RPROMPT_INDENT: string;
	export const COMMAND_MODE: string;
	export const __CFBundleIdentifier: string;
	export const GIT_EDITOR: string;
	export const OPENAI_API_KEY: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const GEMINI_API_KEY: string;
	export const FPATH: string;
	export const AI_AGENT: string;
	export const npm_lifecycle_script: string;
	export const LS_COLORS: string;
	export const POSH_SESSION_ID: string;
	export const POWERLINE_COMMAND: string;
	export const LOGNAME: string;
	export const npm_config_local_prefix: string;
	export const npm_package_name: string;
	export const npm_config_noproxy: string;
	export const CLAUDECODE: string;
	export const npm_config_cache: string;
	export const TERM_PROGRAM_VERSION: string;
	export const CLAUDE_EFFORT: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const TERM: string;
	export const TMPDIR: string;
	export const SHELL: string;
	export const CLAUDE_CODE_CHILD_SESSION: string;
	export const POSH_SHELL: string;
	export const CLAUDE_PID: string;
	export const CLICOLOR: string;
	export const NODE: string;
	export const npm_config_node_gyp: string;
	export const PWD: string;
	export const NVM_CD_FLAGS: string;
	export const VIMEO_ACCESS_TOKEN: string;
	export const NVM_BIN: string;
	export const HOMEBREW_PREFIX: string;
	export const HOMEBREW_REPOSITORY: string;
	export const COLOR: string;
	export const LESS: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const npm_config_init_module: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const HOME: string;
	export const TERM_PROGRAM: string;
	export const NVM_INC: string;
	export const LaunchInstanceID: string;
	export const POLYGON_API_KEY: string;
	export const MANPATH: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const npm_config_global_prefix: string;
	export const NODE_ENV: string;
	export const CLAUDE_CODE_EXECPATH: string;
	export const GHOSTTY_RESOURCES_DIR: string;
	export const ZSH: string;
	export const INIT_CWD: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		DATABASE_URL: string;
		ENCRYPTION_KEY: string;
		JWT_SECRET: string;
		NEXT_PUBLIC_TEST_MODE: string;
		OPENROUTER_API_KEY: string;
		OPENROUTER_EMBEDDING_MODEL: string;
		OPENROUTER_MODEL: string;
		COLORTERM: string;
		OSLogRateLimit: string;
		npm_config_user_agent: string;
		GHOSTTY_BIN_DIR: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		XDG_DATA_DIRS: string;
		INFOPATH: string;
		OSTYPE: string;
		npm_config_prefix: string;
		SHLVL: string;
		XPC_SERVICE_NAME: string;
		npm_config_npm_version: string;
		LANG: string;
		POSH_SHELL_VERSION: string;
		EDITOR: string;
		npm_lifecycle_event: string;
		TERMINFO: string;
		XPC_FLAGS: string;
		npm_command: string;
		CLAUDE_CODE_SESSION_ID: string;
		GHOSTTY_SHELL_FEATURES: string;
		SVELTEKIT_FORK: string;
		npm_node_execpath: string;
		_: string;
		npm_package_json: string;
		PATH: string;
		npm_config_userconfig: string;
		npm_execpath: string;
		LSCOLORS: string;
		PAGER: string;
		npm_package_version: string;
		VIRTUAL_ENV_DISABLE_PROMPT: string;
		HOMEBREW_CELLAR: string;
		PYENV_VIRTUALENV_DISABLE_PROMPT: string;
		SECURITYSESSIONID: string;
		SSH_AUTH_SOCK: string;
		npm_config_globalconfig: string;
		ZLE_RPROMPT_INDENT: string;
		COMMAND_MODE: string;
		__CFBundleIdentifier: string;
		GIT_EDITOR: string;
		OPENAI_API_KEY: string;
		USER: string;
		NVM_DIR: string;
		GEMINI_API_KEY: string;
		FPATH: string;
		AI_AGENT: string;
		npm_lifecycle_script: string;
		LS_COLORS: string;
		POSH_SESSION_ID: string;
		POWERLINE_COMMAND: string;
		LOGNAME: string;
		npm_config_local_prefix: string;
		npm_package_name: string;
		npm_config_noproxy: string;
		CLAUDECODE: string;
		npm_config_cache: string;
		TERM_PROGRAM_VERSION: string;
		CLAUDE_EFFORT: string;
		CONDA_PROMPT_MODIFIER: string;
		TERM: string;
		TMPDIR: string;
		SHELL: string;
		CLAUDE_CODE_CHILD_SESSION: string;
		POSH_SHELL: string;
		CLAUDE_PID: string;
		CLICOLOR: string;
		NODE: string;
		npm_config_node_gyp: string;
		PWD: string;
		NVM_CD_FLAGS: string;
		VIMEO_ACCESS_TOKEN: string;
		NVM_BIN: string;
		HOMEBREW_PREFIX: string;
		HOMEBREW_REPOSITORY: string;
		COLOR: string;
		LESS: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		npm_config_init_module: string;
		__CF_USER_TEXT_ENCODING: string;
		HOME: string;
		TERM_PROGRAM: string;
		NVM_INC: string;
		LaunchInstanceID: string;
		POLYGON_API_KEY: string;
		MANPATH: string;
		NoDefaultCurrentDirectoryInExePath: string;
		npm_config_global_prefix: string;
		NODE_ENV: string;
		CLAUDE_CODE_EXECPATH: string;
		GHOSTTY_RESOURCES_DIR: string;
		ZSH: string;
		INIT_CWD: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
