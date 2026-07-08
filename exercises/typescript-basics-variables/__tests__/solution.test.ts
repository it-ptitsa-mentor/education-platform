// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { repeat } from "../solution.ts";

describe("typescript-basics-variables: repeat()", () => {
  it("repeats a string the given number of times", () => {
    expect(repeat('hexlet', 2)).toBe('hexlethexlet');
    expect(repeat('wo', 3)).toBe('wowowo');
    expect(repeat('a', 1)).toBe('a');
    expect(repeat('x', 0)).toBe('');
  });
});
