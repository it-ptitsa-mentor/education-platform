// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasAllProperties,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-selectors — структурные проверки", () => {
  it("styles/app.css задаёт цвет и размер шрифта для заголовков", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["color", "font-size"], "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css использует дочерние или потомственные селекторы", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    // Check for descendant (space) or child (>) selectors inside .articles or h1/h2/h3
    const hasDescendantSelector = /\.articles\s+\w|h[1-3]\s*\{|h[1-3]\s*,/.test(css);
    expect(hasDescendantSelector).toBe(true);
  });
});
