// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { isTheSamePoint } from "../solution.ts";
import type { Point } from "../solution.ts";

describe("typescript-basics-tuples: isTheSamePoint()", () => {
  it("returns true for equal points", () => {
    const p1: Point = [1, 3, 4];
    const p2: Point = [1, 3, 4];
    expect(isTheSamePoint(p1, p2)).toBe(true);
  });
  it("returns false for different points", () => {
    const p1: Point = [1, 3, 4];
    const p3: Point = [0, 8, 4];
    expect(isTheSamePoint(p1, p3)).toBe(false);
  });
});
