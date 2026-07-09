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

describe("css-grid-first-grid — структурные проверки", () => {
  it("styles/app.css содержит grid-container с display:grid и grid-template-columns", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(
        css,
        ["display", "grid-template-columns"],
        "styles/app.css",
      ),
      assertCssHasValue(css, "display", /grid/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт 200px-колонку для grid-header", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "grid-template-columns", /200px/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт 300px-колонку для grid-main", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "grid-template-columns", /300px/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
