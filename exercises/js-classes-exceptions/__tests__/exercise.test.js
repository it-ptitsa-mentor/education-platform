import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-classes-exceptions", () => {
  it("src/File.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/File.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/Utils.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/Utils.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/errors/FileError.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/errors/FileError.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/errors/NotExistsError.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/errors/NotExistsError.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/errors/NotReadableError.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/errors/NotReadableError.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
