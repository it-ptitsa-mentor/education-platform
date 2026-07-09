// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasProperty,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-positioning-absolute — структурные проверки", () => {
  it("styles/app.css использует position:absolute для расположения квадратов", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "position", "styles/app.css"),
      assertCssHasValue(css, "position", /absolute/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт top и left координаты", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "top", "styles/app.css"),
      assertCssHasProperty(css, "left", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
