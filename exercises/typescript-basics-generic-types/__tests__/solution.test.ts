// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { MySet } from "../solution.ts";

describe("typescript-basics-generic-types: MySet", () => {
  it("add returns the count of elements", () => {
    const s = new MySet<number>();
    expect(s.add(1)).toBe(1);
    expect(s.add(10)).toBe(2);
  });

  it("add does not add duplicates", () => {
    const s = new MySet<number>();
    s.add(1);
    s.add(1);
    expect(s.items.length).toBe(1);
  });

  it("has returns true for existing items", () => {
    const s = new MySet<number>();
    s.add(1);
    expect(s.has(1)).toBe(true);
    expect(s.has(8)).toBe(false);
  });
});
