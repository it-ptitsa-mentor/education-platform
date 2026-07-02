import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.getSameCount;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-nested-loops", () => {
  it("считает количество общих уникальных значений", async () => {
    const getSameCount = await loadFunction();
    expect(getSameCount([1, 3, 2, 2], [3, 1, 1, 2, 5])).toBe(3);
    expect(getSameCount([1, 4, 4], [4, 8, 4])).toBe(1);
    expect(getSameCount([1, 10, 3], [10, 100, 35, 1])).toBe(2);
  });

  it("возвращает 0 для пустых массивов", async () => {
    const getSameCount = await loadFunction();
    expect(getSameCount([], [])).toBe(0);
    expect(getSameCount([1, 2], [])).toBe(0);
  });
});
