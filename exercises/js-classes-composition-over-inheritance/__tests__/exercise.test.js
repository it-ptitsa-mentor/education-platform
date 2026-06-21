import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-classes-composition-over-inheritance", () => {
  it("src/Sanitizer.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/Sanitizer.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/SanitizerStripTagsDecorator.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/SanitizerStripTagsDecorator.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
