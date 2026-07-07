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
      "@testing-library/dom": require.resolve("@testing-library/dom"),
      // Point at the ESM build; require.resolve would pick the CJS entry,
      // which cannot `require('vitest')` under vite.
      "@testing-library/jest-dom/matchers": require
        .resolve("@testing-library/jest-dom/matchers")
        .replace(/\.js$/, ".mjs"),
      "@testing-library/jest-dom": require
        .resolve("@testing-library/jest-dom")
        .replace(/\.js$/, ".mjs"),
      "@testing-library/user-event": require.resolve("@testing-library/user-event"),
      axios: require.resolve("axios"),
      "es-toolkit": require.resolve("es-toolkit"),
      "escape-goat": require.resolve("escape-goat"),
      i18next: require.resolve("i18next"),
      jquery: require.resolve("jquery"),
      lodash: require.resolve("lodash"),
      "msw/node": require.resolve("msw/node"),
      msw: require.resolve("msw"),
      yup: require.resolve("yup"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["**/__tests__/**/*.{js,ts}"],
    setupFiles: [require.resolve("./vitest.exercise.setup.ts")],
  },
});
