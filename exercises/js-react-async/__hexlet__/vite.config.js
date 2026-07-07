import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: '/var/tmp/.vite',
  test: {
    pool: 'threads',
    environment: 'jsdom',
    testMatch: ['./__tests__/**/*.test.jsx'],
    globals: true,
  },
})
