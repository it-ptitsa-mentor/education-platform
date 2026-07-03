import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../points.js");
  const fn = mod.default ?? mod.calculateDistance;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию calculateDistance (export default)");
  }
  return fn;
};

describe("js-data-abstraction-points", () => {
  it("находит расстояние между точками", async () => {
    const calculateDistance = await loadFunction();
    expect(calculateDistance([0, 0], [3, 4])).toBe(5);
    expect(calculateDistance([-1, -1], [2, 3])).toBe(5);
  });

  it("работает с дробными результатами и совпадающими точками", async () => {
    const calculateDistance = await loadFunction();
    expect(calculateDistance([0, 0], [1, 1])).toBeCloseTo(Math.sqrt(2), 10);
    expect(calculateDistance([2, 7], [2, 7])).toBe(0);
  });
});
