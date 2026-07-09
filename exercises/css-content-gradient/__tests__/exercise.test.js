// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasAnyProperty,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-gradient — структурные проверки", () => {
  it("styles/app.css использует градиент (linear-gradient или repeating-linear-gradient)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const hasGradient = /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/im.test(css);
    expect(hasGradient).toBe(true);
  });
});
