import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-integration", () => {
  it("src/slices/index.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/index.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/slices/tasksSlice.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/tasksSlice.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
