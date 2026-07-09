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

describe("css-flex-items-flexible — структурные проверки", () => {
  it("styles/app.css задаёт вертикальный flex-контейнер на всю высоту", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
      assertCssHasValue(css, "flex-direction", /column/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт растягиваемые элементы (flex) и запрет сжатия (flex-shrink: 0)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(css, ["flex", "flex-grow"], "styles/app.css"),
      assertCssHasValue(css, "flex-shrink", /0/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
