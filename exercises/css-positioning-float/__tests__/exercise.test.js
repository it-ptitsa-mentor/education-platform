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

describe("css-positioning-float — структурные проверки", () => {
  it("styles/app.css использует float для трёхколоночного макета", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "float", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css использует clear для сброса обтекания", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "clear", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
