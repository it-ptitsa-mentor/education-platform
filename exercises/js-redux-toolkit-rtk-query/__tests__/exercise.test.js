import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-rtk-query", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../src/services/index.js")).resolves.toBeDefined();
  });
});


import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-rtk-query components", () => {
  it("src/components/TodoBox.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/TodoBox.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });
});
