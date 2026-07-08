// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { multiply } from "../solution.ts";

describe("typescript-basics-typescript-as-a-second-language: multiply()", () => {
  it("multiplies two numbers", () => {
    expect(multiply(3, 8)).toBe(24);
    expect(multiply(1, 2)).toBe(2);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(-3, 4)).toBe(-12);
  });
});
