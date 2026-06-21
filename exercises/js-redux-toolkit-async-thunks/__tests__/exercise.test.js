import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-async-thunks", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../src/slices/tasksSlice.js")).resolves.toBeDefined();
  });
});


import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-async-thunks components", () => {
  it("src/components/NewTaskForm.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/NewTaskForm.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/components/Tasks.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Tasks.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });
});
