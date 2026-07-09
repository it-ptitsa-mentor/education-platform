// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasValue,
  assertCssHasPseudoClass,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-positioning-relative-and-absolute — структурные проверки", () => {
  it("styles/app.css использует комбинацию relative и absolute для карточки", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "position", /relative/, "styles/app.css"),
      assertCssHasValue(css, "position", /absolute/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css показывает описание при :hover", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasPseudoClass(css, "hover", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
