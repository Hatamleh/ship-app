import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  // Port 3000 rather than Vite's default 5173, so existing course material and
  // bookmarks keep working after the move from Next.
  server: { port: 3000 },
  preview: { port: 3000 },
  // bcrypt is a native module and must not be pre-bundled by Vite.
  optimizeDeps: {
    exclude: ['bcrypt'],
  },
})
