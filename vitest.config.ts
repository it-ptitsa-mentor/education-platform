import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts"],
    exclude: ["**/*.feature.test.ts", "**/node_modules/**"],
  },
});
