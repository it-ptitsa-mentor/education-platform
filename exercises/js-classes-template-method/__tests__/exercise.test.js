import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-classes-template-method", () => {
  it("HTMLDivElement.js", () => {
    const content = readFileSync(path.join(exerciseDir, "HTMLDivElement.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("HTMLPairElement.js", () => {
    const content = readFileSync(path.join(exerciseDir, "HTMLPairElement.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
