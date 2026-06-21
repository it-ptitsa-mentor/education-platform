import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-react-hooks-use-state", () => {
  it("src/BtnGroup.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/BtnGroup.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });
});
