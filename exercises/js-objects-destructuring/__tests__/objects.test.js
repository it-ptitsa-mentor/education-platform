import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default ?? mod.getSortedNames;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-destructuring", () => {
  it("возвращает отсортированный список имён", async () => {
    const getSortedNames = await loadFunction();
    const users = [
      { name: "Bronn", gender: "male", birthday: "1973-03-23" },
      { name: "Reigar", gender: "male", birthday: "1973-11-03" },
      { name: "Eiegon", gender: "male", birthday: "1963-11-03" },
      { name: "Sansa", gender: "female", birthday: "2012-11-03" },
    ];
    expect(getSortedNames(users)).toEqual([
      "Bronn",
      "Eiegon",
      "Reigar",
      "Sansa",
    ]);
  });

  it("возвращает пустой массив для пустого списка", async () => {
    const getSortedNames = await loadFunction();
    expect(getSortedNames([])).toEqual([]);
  });
});
