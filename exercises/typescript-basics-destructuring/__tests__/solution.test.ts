// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { lessonsCount } from "../solution.ts";

describe("typescript-basics-destructuring: lessonsCount()", () => {
  it("returns the number of lessons in a course", () => {
    expect(lessonsCount({ lessons: ['intro', 'lala'] })).toBe(2);
    expect(lessonsCount({ lessons: [] })).toBe(0);
    expect(lessonsCount({ lessons: ['a', 'b', 'c'] })).toBe(3);
  });
});
