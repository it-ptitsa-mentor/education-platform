import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-polymorphism-strategy", () => {
  it("Navigator.js", () => {
    const content = readFileSync(path.join(exerciseDir, "Navigator.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("strategies/Driving.js", () => {
    const content = readFileSync(path.join(exerciseDir, "strategies/Driving.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("strategies/Walking.js", () => {
    const content = readFileSync(path.join(exerciseDir, "strategies/Walking.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
