import { defineConfig } from "vitest/config";

/** Shared config for exercise runs in temp dirs (no local node_modules). */
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.{js,ts}"],
  },
});
