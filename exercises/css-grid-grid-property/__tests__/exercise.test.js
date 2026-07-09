// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-grid-grid-property — структурные проверки", () => {
  it("styles/app.css использует CSS Grid с gap 20px", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["display", "grid-template-columns"], "styles/app.css"),
      assertCssHasValue(css, "display", /grid/, "styles/app.css"),
      assertCssHasValue(css, "gap", /20px/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт 8-колоночную и 12-колоночную сетки через grid-template-columns", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    // Должны быть упомянуты span 8 или repeat(8) и span 12 или repeat(12)
    const hasBigGrid = /repeat\s*\(\s*(?:8|12)\s*,/.test(css) || /span\s+(?:8|12)/.test(css) || /grid-template-columns[^;]*(?:8|12)/.test(css);
    expect(hasBigGrid).toBe(true);
  });
});
