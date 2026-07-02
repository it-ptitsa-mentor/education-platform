import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.swap ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию swap");
  }
  return fn;
};

describe("js-arrays-modification", () => {
  it("меняет местами первый и последний элементы", async () => {
    const swap = await loadFunction();
    expect(swap([1, 2])).toEqual([2, 1]);
    expect(swap(["one", "two", "three"])).toEqual(["three", "two", "one"]);
  });

  it("возвращает короткие массивы как есть", async () => {
    const swap = await loadFunction();
    expect(swap([])).toEqual([]);
    expect(swap([1])).toEqual([1]);
  });
});
