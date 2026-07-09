// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAllTags,
  assertCssHasAllProperties,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-box-model — структурные проверки", () => {
  it("index.html содержит изображение, заголовок и параграф", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["img", "h2", "p"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css применяет блочную модель (padding, border, border-radius)", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["padding", "border", "border-radius"], "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
