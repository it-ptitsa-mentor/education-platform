// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { MyMap } from "../solution.ts";

describe("typescript-basics-many-parameters: MyMap", () => {
  it("set and get values", () => {
    const map = new MyMap<string, number>();
    map.set("one", 1);
    map.set("two", 2);
    expect(map.get("one")).toBe(1);
    expect(map.get("two")).toBe(2);
  });

  it("get returns undefined for missing key", () => {
    const map = new MyMap<string, number>();
    expect(map.get("three")).toBeUndefined();
  });

  it("set is chainable (returns this)", () => {
    const map = new MyMap<string, number>();
    const map1 = map.set("one", 1);
    expect(map1.get("one")).toBe(1);
    expect(map1).toBe(map);
  });
});
