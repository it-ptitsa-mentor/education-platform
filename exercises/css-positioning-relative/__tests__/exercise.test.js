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

describe("css-positioning-relative — структурные проверки", () => {
  it("styles/app.css использует position:relative при :hover", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "position", /relative/, "styles/app.css"),
      assertCssHasPseudoClass(css, "hover", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
