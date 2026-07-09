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

describe("css-content-list — структурные проверки", () => {
  it("index.html содержит заголовки и списки (h1, h2, h3, ol, ul)", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8");
    const errors = collectStructuralErrors([
      assertHtmlHasAllTags(html, ["h1", "h2", "h3", "ol", "ul"], "index.html"),
    ]);
    expect(errors).toEqual([]);
  });
});
