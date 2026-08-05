import type { User } from '$lib/types'

// See https://svelte.dev/docs/kit/types#app
declare global {
  namespace App {
    interface Locals {
      /**
       * The signed-in user, populated by the handle hook in src/hooks.server.ts
       * from the auth_session JWT cookie. Null when not signed in.
       */
      user: User | null
    }
  }
}

export {}
