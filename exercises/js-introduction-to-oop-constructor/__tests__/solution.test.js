import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Point = (await import("../Point.js")).default;
  const Segment = (await import("../Segment.js")).default;
  const reverse = (await import("../solution.js")).default;
  if (typeof Point !== "function") {
    throw new Error("Экспортируйте конструктор Point (export default)");
  }
  if (typeof Segment !== "function") {
    throw new Error("Экспортируйте конструктор Segment (export default)");
  }
  if (typeof reverse !== "function") {
    throw new Error("Экспортируйте функцию reverse (export default)");
  }
  return { Point, Segment, reverse };
};

describe("js-introduction-to-oop-constructor", () => {
  it("Point и Segment хранят свойства и отдают их через геттеры", async () => {
    const { Point, Segment } = await loadAll();
    const point = new Point(1, 10);
    expect(point.getX()).toBe(1);
    expect(point.getY()).toBe(10);

    const begin = new Point(1, 10);
    const end = new Point(11, -3);
    const segment = new Segment(begin, end);
    expect(segment.getBeginPoint()).toBe(begin);
    expect(segment.getEndPoint()).toBe(end);
  });

  it("reverse меняет точки местами", async () => {
    const { Point, Segment, reverse } = await loadAll();
    const segment = new Segment(new Point(1, 10), new Point(11, -3));
    const reversed = reverse(segment);
    expect(reversed.getBeginPoint().getX()).toBe(11);
    expect(reversed.getBeginPoint().getY()).toBe(-3);
    expect(reversed.getEndPoint().getX()).toBe(1);
    expect(reversed.getEndPoint().getY()).toBe(10);
  });

  it("reverse копирует точки по значению", async () => {
    const { Point, Segment, reverse } = await loadAll();
    const begin = new Point(1, 10);
    const end = new Point(11, -3);
    const segment = new Segment(begin, end);
    const reversed = reverse(segment);
    expect(reversed.getBeginPoint()).not.toBe(end);
    expect(reversed.getEndPoint()).not.toBe(begin);
  });
});
