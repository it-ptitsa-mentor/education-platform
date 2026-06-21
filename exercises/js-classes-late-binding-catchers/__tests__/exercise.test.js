import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-classes-late-binding-catchers", () => {
  it("catchers.js", () => {
    const content = readFileSync(path.join(exerciseDir, "catchers.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("runCode.js", () => {
    const content = readFileSync(path.join(exerciseDir, "runCode.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
