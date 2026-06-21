import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("http-https", () => {
  it("http_solution", () => {
    const content = readFileSync(path.join(exerciseDir, "http_solution"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("https_solution", () => {
    const content = readFileSync(path.join(exerciseDir, "https_solution"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
