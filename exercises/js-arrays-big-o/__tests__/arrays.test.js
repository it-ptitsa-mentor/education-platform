import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.getIntersectionOfSortedArrays;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-big-o", () => {
  it("находит пересечение отсортированных массивов", async () => {
    const getIntersection = await loadFunction();
    expect(
      getIntersection([10, 11, 24], [10, 13, 14, 18, 24, 30]),
    ).toEqual([10, 24]);
  });

  it("возвращает пустой массив без пересечения", async () => {
    const getIntersection = await loadFunction();
    expect(getIntersection([10, 11, 24], [-2, 3, 4])).toEqual([]);
    expect(getIntersection([], [2])).toEqual([]);
  });

  it("не дублирует элементы в результате", async () => {
    const getIntersection = await loadFunction();
    expect(getIntersection([1, 2, 2, 3], [2, 2, 3])).toEqual([2, 3]);
  });
});
