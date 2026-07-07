import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    mockReset: false,
    globals: true,
    pool: 'threads',
    isolate: false,
    maxWorkers: 1,
    minWorkers: 1,
  },
  root: '/usr/src/app',
  server: {
    allowedHosts: true,
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
      interval: 300
    }
  },
  cacheDir: '/var/tmp/.vite',
  plugins: [react({
    jsxRuntime: 'automatic',
  })],
})
