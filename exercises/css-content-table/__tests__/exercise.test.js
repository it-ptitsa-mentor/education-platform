// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertHtmlHasAllTags,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-table — структурные проверки", () => {
  it("index.html содержит таблицу с строками и ячейками", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["table", "tr"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });

  it("index.html содержит ячейки таблицы (td или th)", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const hasCells = /<td[\s>]/.test(html) || /<th[\s>]/.test(html);
    expect(hasCells).toBe(true);
  });
});
