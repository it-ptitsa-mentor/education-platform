// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { last } from "../solution.ts";

describe("typescript-basics-generics-overview: last()", () => {
  it("returns null for empty array", () => {
    expect(last([])).toBeNull();
  });

  it("returns last element of number array", () => {
    expect(last([3, 2])).toBe(2);
    expect(last([1])).toBe(1);
  });

  it("returns last element of string array", () => {
    expect(last(["code-basics", "hexlet"])).toBe("hexlet");
  });
});
