// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getEvenNumbers } from "../solution.ts";

describe("typescript-basics-anonymous-functions: getEvenNumbers()", () => {
  it("returns only even numbers from array", () => {
    expect(getEvenNumbers([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    expect(getEvenNumbers([1, 3, 5])).toEqual([]);
    expect(getEvenNumbers([2, 4])).toEqual([2, 4]);
    expect(getEvenNumbers([])).toEqual([]);
  });
});
