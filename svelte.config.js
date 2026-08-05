import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-node because the AI features need the Node runtime:
    // Prisma, bcrypt and the LangChain adapters do not run on edge.
    adapter: adapter(),
  },
}

export default config
