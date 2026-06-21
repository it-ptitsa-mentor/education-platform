import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("regexp-alternation", () => {
  it("solution", () => {
    const content = readFileSync(path.join(exerciseDir, "solution"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
