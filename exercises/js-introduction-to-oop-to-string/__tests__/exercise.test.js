import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-introduction-to-oop-to-string", () => {
  it("Point.js", () => {
    const content = readFileSync(path.join(exerciseDir, "Point.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("Segment.js", () => {
    const content = readFileSync(path.join(exerciseDir, "Segment.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
