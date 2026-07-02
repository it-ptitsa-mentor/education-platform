import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.calculateSum;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-aggregation", () => {
  it("суммирует элементы, кратные трём", async () => {
    const calculateSum = await loadFunction();
    expect(calculateSum([8, 9, 21, 19, 18, 22, 7])).toBe(48);
    expect(calculateSum([2, 0, 17, 3, 9, 15, 4])).toBe(27);
  });

  it("возвращает 0 для пустого массива", async () => {
    const calculateSum = await loadFunction();
    expect(calculateSum([])).toBe(0);
  });

  it("возвращает 0 когда кратных трём нет", async () => {
    const calculateSum = await loadFunction();
    expect(calculateSum([1, 2, 4, 5])).toBe(0);
  });
});
