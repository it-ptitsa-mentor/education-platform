import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.calculateAverage;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-for-of", () => {
  it("считает среднее арифметическое", async () => {
    const calculateAverage = await loadFunction();
    expect(calculateAverage([37.5, 34, 39.3, 40, 38.7, 41.5])).toBe(38.5);
    expect(calculateAverage([36, 37.4, 39, 41, 36.6])).toBe(38);
  });

  it("возвращает null для пустого массива", async () => {
    const calculateAverage = await loadFunction();
    expect(calculateAverage([])).toBeNull();
  });
});
