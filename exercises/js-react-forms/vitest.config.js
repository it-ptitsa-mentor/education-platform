import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  test: {
    cacheDir: '/var/tmp/.vite',
    environment: 'jsdom',
    pool: 'threads',
    testMatch: ['./__tests__/**/*.test.jsx'],
    globals: true,
  },
})
