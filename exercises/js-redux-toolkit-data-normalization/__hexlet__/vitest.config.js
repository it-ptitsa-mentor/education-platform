import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  test: {
    environment: 'jsdom',
    pool: 'threads',
    globals: true,
    testTimeout: 5000,
  },
  cacheDir: '/var/tmp/.vite',
})
