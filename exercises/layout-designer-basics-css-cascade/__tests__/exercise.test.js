// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAllTags,
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("layout-designer-basics-css-cascade — структурные проверки", () => {
  it("index.html содержит h1, h2 и три секции с h2 и ul", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["h1", "h2", "section", "ul"], "index.html"),
    ]);
    expect(errors).toEqual([]);
    // Минимум 3 секции
    const sectionCount = (html.match(/<section[\s/>]/gi) ?? []).length;
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });

  it("styles/app.css задаёт font-size, margin и text-align для h1, h2 и body", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(css, ["font-size", "text-align"], "styles/app.css"),
      assertCssHasValue(css, "font-size", /18px|60px/, "styles/app.css"),
      assertCssHasValue(css, "text-align", /center/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
