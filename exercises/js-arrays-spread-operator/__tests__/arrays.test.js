import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.flatten ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию flatten");
  }
  return fn;
};

describe("js-arrays-spread-operator", () => {
  it("раскрывает один уровень вложенности", async () => {
    const flatten = await loadFunction();
    expect(flatten([1, [3, 2], 9])).toEqual([1, 3, 2, 9]);
    expect(flatten([1, [[2], [3]], [9]])).toEqual([1, [2], [3], 9]);
  });

  it("возвращает пустой массив для пустого входа", async () => {
    const flatten = await loadFunction();
    expect(flatten([])).toEqual([]);
  });
});
