import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.bubbleSort;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-sorting", () => {
  it("сортирует массив по возрастанию", async () => {
    const bubbleSort = await loadFunction();
    expect(bubbleSort([3, 10, 4, 3])).toEqual([3, 3, 4, 10]);
    expect(bubbleSort([5, -1, 0])).toEqual([-1, 0, 5]);
  });

  it("возвращает пустой массив и одиночный элемент как есть", async () => {
    const bubbleSort = await loadFunction();
    expect(bubbleSort([])).toEqual([]);
    expect(bubbleSort([7])).toEqual([7]);
  });
});
