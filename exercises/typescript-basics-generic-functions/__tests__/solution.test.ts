// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { MyArray } from "../solution.ts";

describe("typescript-basics-generic-functions: MyArray", () => {
  it("push adds items and returns new count", () => {
    const coll = new MyArray<number>();
    expect(coll.push(1)).toBe(1);
    expect(coll.push(10)).toBe(2);
    expect(coll.push(99)).toBe(3);
    expect(coll.items).toEqual([1, 10, 99]);
  });

  it("filter returns a new MyArray with filtered items", () => {
    const coll = new MyArray<number>();
    coll.push(1);
    coll.push(10);
    coll.push(99);
    const even = coll.filter((v) => v % 2 === 0);
    expect(even.items).toEqual([10]);
  });

  it("filter does not mutate original", () => {
    const coll = new MyArray<number>();
    coll.push(1);
    coll.push(2);
    coll.filter((v) => v > 1);
    expect(coll.items).toEqual([1, 2]);
  });
});
