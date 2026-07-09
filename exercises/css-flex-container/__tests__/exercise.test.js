// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasProperty,
  assertCssHasValue,
  assertCssHasRules,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-container — структурные проверки", () => {
  it("styles/app.css содержит display:flex для двухколоночного макета", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasRules(css, "styles/app.css"),
      assertCssHasProperty(css, "display", "styles/app.css"),
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css использует свойство order для изменения порядка элементов", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "order", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
