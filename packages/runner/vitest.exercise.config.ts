import { createRequire } from "node:module";
import path from "node:path";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

/**
 * Shared config for exercise runs in temp dirs (no local node_modules).
 * Aliases expose whitelisted npm packages from the repo root to exercise
 * code and tests, since bare imports do not resolve from the temp dir.
 */
export default defineConfig({
  // Original Hexlet React tests rely on the automatic JSX runtime
  // (no `import React` in test files).
  esbuild: { jsx: "automatic" },
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
      classnames: require.resolve("classnames"),
      "es-toolkit": require.resolve("es-toolkit"),
      "escape-goat": require.resolve("escape-goat"),
      i18next: require.resolve("i18next"),
      jquery: require.resolve("jquery"),
      "immutability-helper": require.resolve("immutability-helper"),
      // Directory alias so subpath imports (lodash/uniqueId) resolve too.
      lodash: path.dirname(require.resolve("lodash")),
      "msw/node": require.resolve("msw/node"),
      msw: require.resolve("msw"),
      imask: require.resolve("imask"),
      "react-i18next": require.resolve("react-i18next"),
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
      "react/jsx-dev-runtime": require.resolve("react/jsx-dev-runtime"),
      "react-dom/client": require.resolve("react-dom/client"),
      "react-dom/test-utils": require.resolve("react-dom/test-utils"),
      "react-bootstrap": require.resolve("react-bootstrap"),
      "react-dom": require.resolve("react-dom"),
      "react-test-renderer": require.resolve("react-test-renderer"),
      react: require.resolve("react"),
      "@testing-library/react": require.resolve("@testing-library/react"),
      "@reduxjs/toolkit/query/react": require.resolve("@reduxjs/toolkit/query/react"),
      "@reduxjs/toolkit/query": require.resolve("@reduxjs/toolkit/query"),
      "@reduxjs/toolkit": require.resolve("@reduxjs/toolkit"),
      "react-redux": require.resolve("react-redux"),
      redux: require.resolve("redux"),
      "whatwg-fetch": require.resolve("whatwg-fetch"),
      yup: require.resolve("yup"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["**/__tests__/**/*.{js,jsx,ts,tsx}"],
    setupFiles: [require.resolve("./vitest.exercise.setup.ts")],
  },
});
