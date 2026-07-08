// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { formatPrice } from "../solution.ts";

describe("typescript-basics-nullable: formatPrice()", () => {
  it("formats a number with 2 decimal places", () => {
    expect(formatPrice(3.145)).toBe('$3.15');
    expect(formatPrice(200)).toBe('$200.00');
  });
  it("returns $0.00 for null or undefined", () => {
    expect(formatPrice()).toBe('$0.00');
    expect(formatPrice(null)).toBe('$0.00');
  });
});
