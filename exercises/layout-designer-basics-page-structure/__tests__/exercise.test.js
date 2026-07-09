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

describe("layout-designer-basics-page-structure — структурные проверки", () => {
  it("index.html содержит DOCTYPE, head с title/charset, h1 и два p", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlContainsText(html, "<!DOCTYPE", "index.html"),
      assertHtmlHasAllTags(html, ["head", "body", "title", "h1", "p"], "index.html"),
      assertHtmlContainsText(html, "UTF-8", "index.html"),
    ]);
    expect(errors).toEqual([]);
    // Минимум 2 параграфа
    const pCount = (html.match(/<p[\s/>]/gi) ?? []).length;
    expect(pCount).toBeGreaterThanOrEqual(2);
  });
});
