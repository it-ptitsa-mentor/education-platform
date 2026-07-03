import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../points.js");
  for (const name of ["makePoint", "getX", "getY"]) {
    if (typeof mod[name] !== "function") {
      throw new Error(`Экспортируйте функцию ${name}()`);
    }
  }
  return mod;
};

describe("js-data-abstraction-interface", () => {
  it("возвращает декартовы координаты точки", async () => {
    const { makePoint, getX, getY } = await loadModule();
    const point = makePoint(4, 8);
    expect(getX(point)).toBe(4);
    expect(getY(point)).toBe(8);
  });

  it("работает с отрицательными координатами и нулём", async () => {
    const { makePoint, getX, getY } = await loadModule();
    const point = makePoint(-3, -7);
    expect(getX(point)).toBe(-3);
    expect(getY(point)).toBe(-7);

    const zero = makePoint(0, 0);
    expect(getX(zero)).toBe(0);
    expect(getY(zero)).toBe(0);
  });
});
