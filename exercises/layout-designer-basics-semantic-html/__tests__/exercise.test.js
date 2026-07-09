// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAllTags,
  assertHtmlContainsText,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("layout-designer-basics-semantic-html — структурные проверки", () => {
  it("index.html содержит семантический header с nav, img (logo.png) и ul с 4 ссылками", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["header", "nav", "img", "ul", "li", "a"], "index.html"),
      assertHtmlContainsText(html, "logo.png", "index.html"),
      assertHtmlContainsText(html, "#", "index.html"),
    ]);
    expect(errors).toEqual([]);
    // Минимум 4 элемента списка
    const liCount = (html.match(/<li[\s/>]/gi) ?? []).length;
    expect(liCount).toBeGreaterThanOrEqual(4);
  });
});
