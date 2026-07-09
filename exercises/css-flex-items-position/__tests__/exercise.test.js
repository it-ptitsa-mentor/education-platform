// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasProperty,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-items-position — структурные проверки", () => {
  it("styles/app.css использует свойство order для сортировки элементов", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    // Должно быть несколько значений order (шаг 1: order: 1, order: 2, ...)
    const orderMatches = [...css.matchAll(/(?:^|[{;,\s])order\s*:/gim)];
    const errors = collectStructuralErrors([
      assertCssHasProperty(css, "order", "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
    expect(orderMatches.length).toBeGreaterThanOrEqual(2);
  });
});
