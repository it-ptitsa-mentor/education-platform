// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAnyTag,
  assertHtmlHasAllTags,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-forms — структурные проверки", () => {
  it("index.html содержит форму (form, input или label)", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAnyTag(html, ["form", "input", "label", "textarea", "button"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("index.html содержит элементы управления вводом", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["input"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });
});
