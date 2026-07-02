import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../joinNumbersFromRange.js");
  const fn = mod.default ?? mod.joinNumbersFromRange;
  if (typeof fn !== "function") {
    throw new Error(
      "Экспортируйте функцию joinNumbersFromRange (export default)",
    );
  }
  return fn;
};

describe("js-basics-aggregation", () => {
  it("объединяет числа диапазона в строку", async () => {
    const joinNumbersFromRange = await loadFunction();
    expect(joinNumbersFromRange(1, 1)).toBe("1");
    expect(joinNumbersFromRange(2, 3)).toBe("23");
    expect(joinNumbersFromRange(5, 10)).toBe("5678910");
  });

  it("работает с отрицательными границами", async () => {
    const joinNumbersFromRange = await loadFunction();
    expect(joinNumbersFromRange(-2, 1)).toBe("-2-101");
  });
});
