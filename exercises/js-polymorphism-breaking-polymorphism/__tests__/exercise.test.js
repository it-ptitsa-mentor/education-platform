import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-polymorphism-breaking-polymorphism", () => {
  it("Guest.js", () => {
    const content = readFileSync(path.join(exerciseDir, "Guest.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("User.js", () => {
    const content = readFileSync(path.join(exerciseDir, "User.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("helpers.js", () => {
    const content = readFileSync(path.join(exerciseDir, "helpers.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
