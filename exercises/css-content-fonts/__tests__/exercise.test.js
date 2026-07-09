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

describe("css-content-fonts — структурные проверки", () => {
  it("styles/app.css задаёт шрифт (font, font-family или font-size)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(
        css,
        ["font-family", "font-size", "font"],
        "styles/app.css",
      ),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт межстрочный интервал (line-height)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(css, ["line-height"], "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
