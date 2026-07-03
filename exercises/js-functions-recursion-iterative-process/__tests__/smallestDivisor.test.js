import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../smallestDivisor.js");
  const fn = mod.default ?? mod.smallestDivisor;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию smallestDivisor (export default)");
  }
  return fn;
};

describe("js-functions-recursion-iterative-process", () => {
  it("находит наименьший делитель составного числа", async () => {
    const smallestDivisor = await loadFunction();
    expect(smallestDivisor(15)).toBe(3);
    expect(smallestDivisor(4)).toBe(2);
    expect(smallestDivisor(121)).toBe(11);
  });

  it("возвращает само число для простого", async () => {
    const smallestDivisor = await loadFunction();
    expect(smallestDivisor(17)).toBe(17);
    expect(smallestDivisor(2)).toBe(2);
  });

  it("возвращает 1 для единицы", async () => {
    const smallestDivisor = await loadFunction();
    expect(smallestDivisor(1)).toBe(1);
  });
});
