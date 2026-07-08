// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { lastIndex } from "../solution.ts";

describe("typescript-basics-union-types: lastIndex()", () => {
  it("returns last index of char or null if not found", () => {
    expect(lastIndex('test', 't')).toBe(3);
    expect(lastIndex('test', 'p')).toBeNull();
    expect(lastIndex('hello', 'l')).toBe(3);
  });
});
