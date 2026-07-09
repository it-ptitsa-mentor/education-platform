import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/__tests__/**/*.js'],
    testTimeout: 5000,
  },
  cacheDir: '/var/tmp/.vite',
});
