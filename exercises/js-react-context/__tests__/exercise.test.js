import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-react-context", () => {
  it("src/App.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/App.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/Home.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/Home.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/Profile.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/Profile.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/ThemeSwitcher.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/ThemeSwitcher.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });
});
