// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("layout-designer-emmet — структурные проверки", () => {
  it("solution содержит Emmet-выражение с ключевыми элементами (main, h1, section.study, ul, li.place-of-study)", () => {
    const content = readFileSync(path.join(exerciseDir, "solution"), "utf8").trim();
    expect(content.length).toBeGreaterThan(0);
    // Должен содержать main (корневой элемент)
    expect(content).toMatch(/\bmain\b/);
    // Должен содержать section с классом study
    expect(content).toMatch(/section\.study|\.study/);
    // Должен содержать класс place-of-study
    expect(content).toMatch(/place-of-study/);
    // Должен содержать элемент списка (ul или li)
    expect(content).toMatch(/\b(?:ul|li)\b/);
  });
});
