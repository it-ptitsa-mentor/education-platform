// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { forEach } from "../solution.ts";

describe("typescript-basics-void: forEach()", () => {
  it("calls callback for each element", () => {
    const results: number[] = [];
    forEach([1, 2, 3], (n: number) => results.push(n));
    expect(results).toEqual([1, 2, 3]);
  });
  it("returns void", () => {
    const result = forEach([1], () => {});
    expect(result).toBeUndefined();
  });
});
