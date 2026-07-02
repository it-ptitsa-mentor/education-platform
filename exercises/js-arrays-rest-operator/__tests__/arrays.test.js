import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.getMax ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getMax");
  }
  return fn;
};

describe("js-arrays-rest-operator", () => {
  it("находит максимальное значение", async () => {
    const getMax = await loadFunction();
    expect(getMax([1, 10, 8])).toBe(10);
    expect(getMax([5])).toBe(5);
    expect(getMax([-3, -1, -7])).toBe(-1);
  });

  it("возвращает null для пустого массива", async () => {
    const getMax = await loadFunction();
    expect(getMax([])).toBeNull();
  });
});
