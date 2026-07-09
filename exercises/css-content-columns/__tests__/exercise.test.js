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

describe("css-content-columns — структурные проверки", () => {
  it("styles/app.css использует CSS Columns (columns или column-count)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(
        css,
        ["columns", "column-count", "column-width"],
        "styles/app.css",
      ),
    ]);
    expect(errors).toEqual([]);
  });
});
