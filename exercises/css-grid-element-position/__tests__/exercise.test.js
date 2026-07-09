// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasAllProperties,
  assertCssHasAnyProperty,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-grid-element-position — структурные проверки", () => {
  it("styles/app.css использует CSS Grid с 6 колонками", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(
        css,
        ["display", "grid-template-columns"],
        "styles/app.css",
      ),
      assertCssHasValue(css, "display", /grid/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css позиционирует элементы через grid-column или grid-area", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(
        css,
        ["grid-column", "grid-row", "grid-area", "grid-template-areas"],
        "styles/app.css",
      ),
    ]);
    expect(errors).toEqual([]);
  });
});
