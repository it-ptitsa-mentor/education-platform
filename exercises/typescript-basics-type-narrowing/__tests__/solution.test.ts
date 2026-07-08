// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { last } from "../solution.ts";

describe("typescript-basics-type-narrowing: last()", () => {
  it("returns last character for string", () => {
    expect(last('hexlet')).toBe('t');
    expect(last('abc')).toBe('c');
  });
  it("returns last digit for number", () => {
    expect(last(123)).toBe(3);
    expect(last(456)).toBe(6);
  });
});
