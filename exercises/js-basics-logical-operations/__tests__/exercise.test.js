import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-basics-logical-operations", () => {
  it("isInternationalPhone.js", () => {
    const content = readFileSync(path.join(exerciseDir, "isInternationalPhone.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
