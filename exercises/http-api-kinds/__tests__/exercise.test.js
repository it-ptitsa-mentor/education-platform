import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("http-api-kinds", () => {
  it("greet", () => {
    const content = readFileSync(path.join(exerciseDir, "greet"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("get_users", () => {
    const content = readFileSync(path.join(exerciseDir, "get_users"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
