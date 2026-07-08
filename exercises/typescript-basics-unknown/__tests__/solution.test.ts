// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { isPlainObject } from "../solution.ts";

describe("typescript-basics-unknown: isPlainObject()", () => {
  it("returns false for primitives", () => {
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject('hexlet')).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
  it("returns true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ name: 'code-basics' })).toBe(true);
  });
  it("returns false for arrays", () => {
    expect(isPlainObject([1, 8])).toBe(false);
    expect(isPlainObject([])).toBe(false);
  });
});
