// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasPseudoClass,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-pseudoclasses — структурные проверки", () => {
  it("styles/app.css использует псевдоклассы (:nth-child или :nth-of-type)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const hasNthPseudo =
      /:nth-child\s*\(/im.test(css) || /:nth-of-type\s*\(/im.test(css);
    expect(hasNthPseudo).toBe(true);
  });
});
