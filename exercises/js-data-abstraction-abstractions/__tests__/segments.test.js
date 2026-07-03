import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../segments.js");
  const required = ["makeSegment", "getMidpointOfSegment", "getBeginPoint", "getEndPoint"];
  for (const name of required) {
    if (typeof mod[name] !== "function") {
      throw new Error(`Экспортируйте функцию ${name}()`);
    }
  }
  return mod;
};

describe("js-data-abstraction-abstractions", () => {
  it("возвращает начало и конец отрезка", async () => {
    const { makeDecartPoint, makeSegment, getBeginPoint, getEndPoint } = await loadModule();
    const beginPoint = makeDecartPoint(3, 2);
    const endPoint = makeDecartPoint(0, 0);
    const segment = makeSegment(beginPoint, endPoint);
    expect(getBeginPoint(segment)).toEqual(beginPoint);
    expect(getEndPoint(segment)).toEqual(endPoint);
  });

  it("находит середину отрезка", async () => {
    const { makeDecartPoint, makeSegment, getMidpointOfSegment, getX, getY } = await loadModule();
    const segment = makeSegment(makeDecartPoint(3, 2), makeDecartPoint(0, 0));
    const midpoint = getMidpointOfSegment(segment);
    expect(getX(midpoint)).toBe(1.5);
    expect(getY(midpoint)).toBe(1);

    const segment2 = makeSegment(makeDecartPoint(-2, -4), makeDecartPoint(2, 4));
    const midpoint2 = getMidpointOfSegment(segment2);
    expect(getX(midpoint2)).toBe(0);
    expect(getY(midpoint2)).toBe(0);
  });
});
