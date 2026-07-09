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

describe("css-content-units — структурные проверки", () => {
  it("styles/app.css использует относительные единицы (rem или em)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const hasRelativeUnits = /\d+(?:\.\d+)?(?:rem|em)\b/.test(css);
    expect(hasRelativeUnits).toBe(true);
  });

  it("styles/app.css задаёт размер шрифта для html", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["font-size"], "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
