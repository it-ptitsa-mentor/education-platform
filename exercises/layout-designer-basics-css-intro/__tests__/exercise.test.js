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

describe("layout-designer-basics-css-intro — структурные проверки", () => {
  it("styles/app.css оформляет класс .quote: цвет #404040, font-weight:bold, font-size:20px, text-align:center", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(
        css,
        ["color", "font-weight", "font-size", "text-align"],
        "styles/app.css",
      ),
      assertCssHasValue(css, "font-weight", /bold/, "styles/app.css"),
      assertCssHasValue(css, "font-size", /20px/, "styles/app.css"),
      assertCssHasValue(css, "text-align", /center/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css оформляет .quote-author: font-weight:normal, font-size:16px, text-align:right", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "font-weight", /normal/, "styles/app.css"),
      assertCssHasValue(css, "font-size", /16px/, "styles/app.css"),
      assertCssHasValue(css, "text-align", /right/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
