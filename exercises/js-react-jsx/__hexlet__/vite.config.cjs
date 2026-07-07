/// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
  })],
  test: {
    pool: 'threads',
    environment: 'jsdom',
    globals: true,
  },
  cache: '/var/tmp/vite',
})
