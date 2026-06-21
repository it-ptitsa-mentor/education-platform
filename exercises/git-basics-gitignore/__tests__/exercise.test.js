import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("git-basics-gitignore", () => {
  it("solution", () => {
    const content = readFileSync(path.join(exerciseDir, "solution"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("code-user/.gitignore", () => {
    const content = readFileSync(path.join(exerciseDir, "code-user/.gitignore"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
