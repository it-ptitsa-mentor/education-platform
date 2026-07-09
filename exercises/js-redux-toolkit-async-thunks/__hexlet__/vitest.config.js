import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    passWithNoTests: true,
    environment: 'jsdom',
    testMatch: ['./__tests__/**/*.test.jsx'],
    globals: true,
    css: true,
    testTimeout: 5000,
  },
  cacheDir: '/var/tmp/.vite',
  resolve: {
    alias: {
      '~bootstrap': '/node_modules/bootstrap/dist/css/bootstrap.min.css',
    },
  },
})
