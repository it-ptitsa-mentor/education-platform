import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../points.js");
  const fn = mod.default ?? mod.getMidpoint;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getMidpoint (export default)");
  }
  return fn;
};

describe("js-data-abstraction-arrays", () => {
  it("находит точку посередине", async () => {
    const getMidpoint = await loadFunction();
    expect(getMidpoint({ x: 0, y: 0 }, { x: 4, y: 4 })).toEqual({ x: 2, y: 2 });
    expect(getMidpoint({ x: 1, y: 3 }, { x: 4, y: 6 })).toEqual({ x: 2.5, y: 4.5 });
  });

  it("работает с отрицательными координатами", async () => {
    const getMidpoint = await loadFunction();
    expect(getMidpoint({ x: -2, y: -4 }, { x: 2, y: 4 })).toEqual({ x: 0, y: 0 });
  });
});
