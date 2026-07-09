import { defineConfig } from "vitest/config";

export default defineConfig({
  // esbuild automatic jsx transform — no plugin needed for tests
  esbuild: { jsx: "automatic" },
  // Force React development build in tests so React.act is available
  define: {
    "process.env.NODE_ENV": '"test"',
  },
  test: {
    // jsdom only for web UI tests; everything else runs in node (default)
    environmentMatchGlobs: [["packages/web/**", "jsdom"]],
    include: ["packages/**/*.test.{ts,tsx}"],
    exclude: ["**/*.feature.test.ts", "**/node_modules/**"],
    setupFiles: ["packages/web/src/__tests__/setup.ts"],
  },
});
