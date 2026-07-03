import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

/**
 * Shared config for exercise runs in temp dirs (no local node_modules).
 * Aliases expose whitelisted npm packages from the repo root to exercise
 * code and tests, since bare imports do not resolve from the temp dir.
 */
export default defineConfig({
  resolve: {
    alias: {
      axios: require.resolve("axios"),
      i18next: require.resolve("i18next"),
      lodash: require.resolve("lodash"),
      yup: require.resolve("yup"),
    },
  },
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.{js,ts}"],
  },
});
