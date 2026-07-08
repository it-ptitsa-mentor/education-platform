// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { filterAnagrams } from "../solution.ts";

describe("typescript-basics-arrays: filterAnagrams()", () => {
  it("finds all anagrams of a word", () => {
    expect(filterAnagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada'])).toEqual(['aabb', 'bbaa']);
    expect(filterAnagrams('racer', ['crazer', 'carer', 'racar', 'caers', 'racer'])).toEqual(['carer', 'racer']);
    expect(filterAnagrams('laser', ['lazing', 'lazy', 'lacer'])).toEqual([]);
  });
});
