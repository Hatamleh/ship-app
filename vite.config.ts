import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  // bcrypt is a native module and must not be pre-bundled by Vite.
  optimizeDeps: {
    exclude: ['bcrypt'],
  },
})
