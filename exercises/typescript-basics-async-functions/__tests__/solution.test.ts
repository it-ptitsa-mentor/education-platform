// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { asyncMap } from "../solution.ts";

describe("typescript-basics-async-functions: asyncMap()", () => {
  it("maps over an array of promises", async () => {
    const promisedNumbers = [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ];
    const result = await asyncMap(promisedNumbers, (num, index) => num * index);
    expect(result).toEqual([0, 2, 6]);
  });

  it("returns an empty array for empty input", async () => {
    const result = await asyncMap([], (x) => x);
    expect(result).toEqual([]);
  });

  it("passes resolved value and index to mapper", async () => {
    const result = await asyncMap(
      [Promise.resolve("a"), Promise.resolve("b")],
      (v, i) => `${i}:${v}`,
    );
    expect(result).toEqual(["0:a", "1:b"]);
  });
});
