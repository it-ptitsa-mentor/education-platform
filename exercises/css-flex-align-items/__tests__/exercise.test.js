// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasTag,
  assertHtmlHasAllTags,
  assertHtmlContainsText,
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-align-items — структурные проверки", () => {
  it("index.html содержит <button> с классами d-flex и flex-center", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasTag(html, "button", "index.html"),
      assertHtmlHasAllTags(html, ["img", "span"], "index.html"),
      assertHtmlContainsText(html, "d-flex", "index.html"),
      assertHtmlContainsText(html, "flex-center", "index.html"),
      assertHtmlContainsText(html, "mr-1", "index.html"),
      assertHtmlContainsText(html, "Принять", "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт display:flex и выравнивание по центру", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["display", "align-items", "justify-content"], "styles/app.css"),
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
      assertCssHasValue(css, "align-items", /center/, "styles/app.css"),
      assertCssHasValue(css, "justify-content", /center/, "styles/app.css"),
      assertCssHasValue(css, "margin-right", /1em/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
