import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
  })],
  cacheDir: '/var/tmp/.vite',
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'threads',
  },
})
