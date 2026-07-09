// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasTag,
  assertHtmlContainsText,
  assertCssHasProperty,
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-flex-grow — структурные проверки", () => {
  it("index.html содержит три колонки: left-aside, content-side (<article>), right-aside", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasTag(html, "article", "index.html"),
      assertHtmlContainsText(html, "left-aside", "index.html"),
      assertHtmlContainsText(html, "content-side", "index.html"),
      assertHtmlContainsText(html, "right-aside", "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт ширины боковых колонок и flex-grow для центра", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["display", "flex-grow"], "styles/app.css"),
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
      assertCssHasValue(css, "width", /200px/, "styles/app.css"),
      assertCssHasValue(css, "width", /350px/, "styles/app.css"),
      assertCssHasValue(css, "min-height", /50vh/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
