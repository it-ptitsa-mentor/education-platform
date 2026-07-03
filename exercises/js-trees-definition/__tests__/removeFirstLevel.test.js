import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../removeFirstLevel.js");
  const fn = mod.default ?? mod.removeFirstLevel;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию removeFirstLevel (export default)");
  }
  return fn;
};

describe("js-trees-definition", () => {
  it("возвращает детей вложенных узлов", async () => {
    const removeFirstLevel = await loadFunction();
    expect(removeFirstLevel([[5], 1, [3, 4]])).toEqual([5, 3, 4]);
    expect(removeFirstLevel([1, 2, [3, 5], [[4, 3], 2]])).toEqual([3, 5, [4, 3], 2]);
  });

  it("возвращает пустой массив, если вложенных узлов нет", async () => {
    const removeFirstLevel = await loadFunction();
    expect(removeFirstLevel([1, 2, 3])).toEqual([]);
    expect(removeFirstLevel([])).toEqual([]);
  });
});
