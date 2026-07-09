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

describe("css-positioning-z-index — структурные проверки", () => {
  it("styles/app.css использует z-index и position для смешивания цветов кругов", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "z-index", "styles/app.css"),
      assertCssHasValue(css, "position", /absolute|relative/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
