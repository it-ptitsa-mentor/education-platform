import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.getSameParity;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-removing", () => {
  it("оставляет элементы той же чётности, что и первый", async () => {
    const getSameParity = await loadFunction();
    expect(getSameParity([1, 2, 3])).toEqual([1, 3]);
    expect(getSameParity([1, 2, 8])).toEqual([1]);
    expect(getSameParity([2, 2, 8])).toEqual([2, 2, 8]);
  });

  it("возвращает пустой массив для пустого входа", async () => {
    const getSameParity = await loadFunction();
    expect(getSameParity([])).toEqual([]);
  });

  it("работает с отрицательными числами", async () => {
    const getSameParity = await loadFunction();
    expect(getSameParity([-1, 2, -3, 4])).toEqual([-1, -3]);
  });
});
