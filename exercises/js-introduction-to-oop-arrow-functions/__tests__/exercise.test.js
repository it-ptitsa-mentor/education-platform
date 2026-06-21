import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-introduction-to-oop-arrow-functions", () => {
  it("collection.js", () => {
    const content = readFileSync(path.join(exerciseDir, "collection.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
