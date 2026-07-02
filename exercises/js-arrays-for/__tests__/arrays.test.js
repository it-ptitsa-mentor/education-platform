import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.addPrefix;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-for", () => {
  it("добавляет префикс с пробелом к каждому элементу", async () => {
    const addPrefix = await loadFunction();
    expect(addPrefix(["john", "smith", "karl"], "Mr")).toEqual([
      "Mr john",
      "Mr smith",
      "Mr karl",
    ]);
  });

  it("не меняет исходный массив", async () => {
    const addPrefix = await loadFunction();
    const names = ["john", "smith"];
    addPrefix(names, "Mr");
    expect(names).toEqual(["john", "smith"]);
  });

  it("возвращает пустой массив для пустого входа", async () => {
    const addPrefix = await loadFunction();
    expect(addPrefix([], "Mr")).toEqual([]);
  });
});
