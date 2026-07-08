// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { filter } from "../solution.ts";

describe("typescript-basics-function-as-parameter: filter()", () => {
  it("filters array elements by predicate", () => {
    const numbers = [1, -5, 2, 3, 4, 133];
    expect(filter(numbers, (n: number) => n > 3)).toEqual([4, 133]);
    expect(filter(numbers, (n: number) => n < 0)).toEqual([-5]);
    expect(filter(numbers, () => false)).toEqual([]);
  });
});
