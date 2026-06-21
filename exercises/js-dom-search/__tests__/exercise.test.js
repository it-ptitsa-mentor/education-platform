import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-dom-search", () => {
  it("src/extractor.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/extractor.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/index.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/index.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
