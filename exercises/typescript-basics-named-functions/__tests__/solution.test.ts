// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getHiddenCard } from "../solution.ts";

describe("typescript-basics-named-functions: getHiddenCard()", () => {
  it("masks card number with default 4 stars", () => {
    expect(getHiddenCard('1234567812345678')).toBe('****5678');
    expect(getHiddenCard('2034399002121100')).toBe('****1100');
  });
  it("masks card number with specified number of stars", () => {
    expect(getHiddenCard('1234567812345678', 2)).toBe('**5678');
    expect(getHiddenCard('1234567812345678', 3)).toBe('***5678');
    expect(getHiddenCard('2034399002121100', 1)).toBe('*1100');
  });
});
