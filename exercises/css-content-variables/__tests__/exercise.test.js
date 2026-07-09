// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasCustomProperty,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-variables — структурные проверки", () => {
  it("styles/app.css определяет CSS-переменные в :root", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const hasRoot = /:root\s*\{/.test(css);
    expect(hasRoot).toBe(true);
  });

  it("styles/app.css задаёт обязательные переменные (primary-color, secondary-color, font-color, background-color)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasCustomProperty(css, "primary-color", "styles/app.css"),
      assertCssHasCustomProperty(css, "secondary-color", "styles/app.css"),
      assertCssHasCustomProperty(css, "font-color", "styles/app.css"),
      assertCssHasCustomProperty(css, "background-color", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт dark-theme с переопределёнными переменными", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const hasDarkTheme = /\.dark-theme\s*\{/.test(css);
    expect(hasDarkTheme).toBe(true);
  });
});
