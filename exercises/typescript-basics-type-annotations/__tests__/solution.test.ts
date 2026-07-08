// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { unique } from "../solution.ts";

describe("typescript-basics-type-annotations: unique()", () => {
  it("removes duplicates keeping first occurrence", () => {
    expect(unique([9, 9, 3, 8, 8])).toEqual([9, 3, 8]);
    expect(unique(['twinkle', 'twinkle', 'little', 'bat'])).toEqual(['twinkle', 'little', 'bat']);
    expect(unique([1, 1, 3, 'oops!'])).toEqual([1, 3, 'oops!']);
    expect(unique([])).toEqual([]);
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });
});
