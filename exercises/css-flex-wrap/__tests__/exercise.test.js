// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasTag,
  assertHtmlContainsText,
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-wrap — структурные проверки", () => {
  it("index.html содержит каталог: <ul class='catalog'> с 6 карточками catalog-item", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasTag(html, "ul", "index.html"),
      assertHtmlHasTag(html, "li", "index.html"),
      assertHtmlHasTag(html, "h3", "index.html"),
      assertHtmlHasTag(html, "img", "index.html"),
      assertHtmlHasTag(html, "p", "index.html"),
      assertHtmlContainsText(html, "catalog", "index.html"),
      assertHtmlContainsText(html, "catalog-item", "index.html"),
      assertHtmlContainsText(html, "price", "index.html"),
    ]);
    expect(errors).toEqual([]);
    // Минимум 6 карточек
    const itemCount = (html.match(/catalog-item/g) ?? []).length;
    expect(itemCount).toBeGreaterThanOrEqual(6);
  });

  it("styles/app.css задаёт flex-wrap и ширину карточек", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["display", "flex-wrap"], "styles/app.css"),
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
      assertCssHasValue(css, "flex-wrap", /wrap/, "styles/app.css"),
      assertCssHasValue(css, "width", /350px/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
