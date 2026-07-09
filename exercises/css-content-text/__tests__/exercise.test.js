// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAllTags,
  assertCssHasAnyProperty,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-text — структурные проверки", () => {
  it("index.html содержит заголовки h1–h4, параграфы и горизонтальную черту", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["h1", "h2", "h3", "h4", "p", "hr"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт оформление текста", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAnyProperty(
        css,
        ["font-size", "line-height", "font-family", "color", "text-indent"],
        "styles/app.css",
      ),
    ]);
    expect(errors).toEqual([]);
  });
});
