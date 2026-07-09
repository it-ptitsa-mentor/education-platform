// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasPseudoElement,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-pseudoelements — структурные проверки", () => {
  it("styles/app.css использует ::before и ::after", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasPseudoElement(css, "before", "styles/app.css"),
      assertCssHasPseudoElement(css, "after", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
