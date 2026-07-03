import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../sequenceSum.js");
  const fn = mod.default ?? mod.sequenceSum;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию sequenceSum (export default)");
  }
  return fn;
};

describe("js-functions-recursion", () => {
  it("находит сумму последовательности", async () => {
    const sequenceSum = await loadFunction();
    expect(sequenceSum(1, 5)).toBe(15);
    expect(sequenceSum(4, 10)).toBe(49);
    expect(sequenceSum(-3, 2)).toBe(-3);
  });

  it("возвращает единственное число последовательности", async () => {
    const sequenceSum = await loadFunction();
    expect(sequenceSum(0, 0)).toBe(0);
    expect(sequenceSum(6, 6)).toBe(6);
  });

  it("возвращает NaN для пустой последовательности", async () => {
    const sequenceSum = await loadFunction();
    expect(sequenceSum(7, 2)).toBeNaN();
  });
});
