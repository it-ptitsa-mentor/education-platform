// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { max } from "../solution.ts";

describe("typescript-basics-rest-spread: max()", () => {
  it("returns the maximum of given numbers", () => {
    expect(max(1, 2, 3)).toBe(3);
    expect(max(234)).toBe(234);
    expect(max(5, 1, 4, 2, 3)).toBe(5);
    expect(max(-1, -2, -3)).toBe(-1);
  });
});
