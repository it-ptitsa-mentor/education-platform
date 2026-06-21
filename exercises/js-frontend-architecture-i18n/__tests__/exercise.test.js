import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-frontend-architecture-i18n", () => {
  it("src/application.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/application.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/locales/en.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/locales/en.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/locales/ru.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/locales/ru.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
