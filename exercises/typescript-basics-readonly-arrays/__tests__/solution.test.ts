// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { reverse } from "../solution.ts";

describe("typescript-basics-readonly-arrays: reverse()", () => {
  it("reverses an array without mutating original", () => {
    expect(reverse([1, 2, 8])).toEqual([8, 2, 1]);
    expect(reverse([10, 33, 7, 0])).toEqual([0, 7, 33, 10]);
    expect(reverse([])).toEqual([]);
    expect(reverse([1])).toEqual([1]);
  });
  it("does not mutate the original array", () => {
    const arr = [1, 2, 3] as const;
    reverse(arr);
    // Should not throw since arr is readonly
  });
});
