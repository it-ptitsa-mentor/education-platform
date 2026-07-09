// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssHasAllProperties,
  assertCssHasValue,
  collectStructuralErrors,
} from "@ptitsa/shared/exercise-checks/html-css-structural-check";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-flex-justify-content — структурные проверки", () => {
  it("styles/app.css прижимает футер к низу через flex-direction:column и justify-content", () => {
    const css = readFileSync(path.join(exerciseDir, "styles/app.css"), "utf8");
    const errors = collectStructuralErrors([
      assertCssHasAllProperties(
        css,
        ["display", "flex-direction", "justify-content"],
        "styles/app.css",
      ),
      assertCssHasValue(css, "display", /flex/, "styles/app.css"),
      assertCssHasValue(css, "flex-direction", /column/, "styles/app.css"),
    ]);
    expect(errors).toEqual([]);
  });
});
