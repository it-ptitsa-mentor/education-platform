// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { map } from "../solution.ts";

describe("typescript-basics-optional-parameters-in-callbacks: map()", () => {
  it("maps array with callback", () => {
    expect(map([3, 9], (n: number) => n - 3)).toEqual([0, 6]);
    expect(map([8, 9], (n: number) => n + 8)).toEqual([16, 17]);
    expect(map([] as number[], (n: number) => n * 2)).toEqual([]);
  });
});
