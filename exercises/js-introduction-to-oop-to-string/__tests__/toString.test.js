import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Point = (await import("../Point.js")).default;
  const Segment = (await import("../Segment.js")).default;
  if (typeof Point !== "function" || typeof Segment !== "function") {
    throw new Error("Экспортируйте конструкторы Point и Segment (export default)");
  }
  return { Point, Segment };
};

describe("js-introduction-to-oop-to-string", () => {
  it("Point.toString()", async () => {
    const { Point } = await loadAll();
    expect(new Point(1, 10).toString()).toBe("(1, 10)");
    expect(new Point(11, -3).toString()).toBe("(11, -3)");
  });

  it("Segment.toString()", async () => {
    const { Point, Segment } = await loadAll();
    const point1 = new Point(1, 10);
    const point2 = new Point(11, -3);
    expect(new Segment(point1, point2).toString()).toBe("[(1, 10), (11, -3)]");
    expect(new Segment(point2, point1).toString()).toBe("[(11, -3), (1, 10)]");
  });
});
