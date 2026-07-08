// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { isComplete } from "../solution.ts";

describe("typescript-basics-objects: isComplete()", () => {
  it("returns true for course with 4+ lessons", () => {
    expect(isComplete({ name: 'JS', lessons: ['a', 'b', 'c', 'd'] })).toBe(true);
    expect(isComplete({ name: 'JS', lessons: ['a', 'b', 'c', 'd', 'e'] })).toBe(true);
  });
  it("returns false for course with < 4 lessons", () => {
    expect(isComplete({ name: 'JS', lessons: ['a', 'b', 'c'] })).toBe(false);
    expect(isComplete({ name: 'JS', lessons: [] })).toBe(false);
  });
});
