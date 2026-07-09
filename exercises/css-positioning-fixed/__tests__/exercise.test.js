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

describe("css-positioning-fixed — структурные проверки", () => {
  it("styles/app.css использует position:fixed для шапки", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "position", /fixed/, "styles/app.css"),
      assertCssHasValue(css, "height", /100px/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт padding-header для компенсации высоты шапки", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "padding-top", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
