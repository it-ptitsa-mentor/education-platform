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

describe("css-content-background — структурные проверки", () => {
  it("index.html содержит контейнер и параграф", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["body"], "index.html"),
      assertHtmlHasAllTags(html, ["p"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("styles/app.css задаёт размеры и фоновое изображение", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasValue(css, "width", /300px/, "styles/app.css"),
      assertCssHasValue(css, "height", /200px/, "styles/app.css"),
      assertCssHasAllProperties(css, ["background-image"], "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
