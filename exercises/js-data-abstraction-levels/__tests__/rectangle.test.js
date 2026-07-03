import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../rectangle.js");
  const required = ["makeRectangle", "containsOrigin", "getStartPoint", "getWidth", "getHeight"];
  for (const name of required) {
    if (typeof mod[name] !== "function") {
      throw new Error(`Экспортируйте функцию ${name}()`);
    }
  }
  return mod;
};

describe("js-data-abstraction-levels", () => {
  it("возвращает параметры прямоугольника через селекторы", async () => {
    const { makeDecartPoint, makeRectangle, getStartPoint, getWidth, getHeight } = await loadModule();
    const point = makeDecartPoint(0, 1);
    const rectangle = makeRectangle(point, 4, 5);
    expect(getStartPoint(rectangle)).toEqual(point);
    expect(getWidth(rectangle)).toBe(4);
    expect(getHeight(rectangle)).toBe(5);
  });

  it("определяет, содержит ли прямоугольник центр координат", async () => {
    const { makeDecartPoint, makeRectangle, containsOrigin } = await loadModule();
    expect(containsOrigin(makeRectangle(makeDecartPoint(0, 1), 4, 5))).toBe(false);
    expect(containsOrigin(makeRectangle(makeDecartPoint(-4, 3), 5, 4))).toBe(true);
    expect(containsOrigin(makeRectangle(makeDecartPoint(2, 5), 3, 3))).toBe(false);
  });

  it("центр координат на границе не считается принадлежащим", async () => {
    const { makeDecartPoint, makeRectangle, containsOrigin } = await loadModule();
    expect(containsOrigin(makeRectangle(makeDecartPoint(0, 2), 4, 2))).toBe(false);
    expect(containsOrigin(makeRectangle(makeDecartPoint(-2, 0), 4, 2))).toBe(false);
  });
});
