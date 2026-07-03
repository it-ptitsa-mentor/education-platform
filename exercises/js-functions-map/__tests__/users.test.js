import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../users.js");
  const fn = mod.default ?? mod.getChildren;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-functions-map", () => {
  it("возвращает плоский список детей", async () => {
    const getChildren = await loadFunction();
    const users = [
      { name: "Tirion", children: [{ name: "Mira", birthday: "1983-03-23" }] },
      { name: "Bronn", children: [] },
      {
        name: "Sam",
        children: [
          { name: "Aria", birthday: "2012-11-03" },
          { name: "Keit", birthday: "1933-05-14" },
        ],
      },
      { name: "Rob", children: [{ name: "Tisha", birthday: "2012-11-03" }] },
    ];
    expect(getChildren(users)).toEqual([
      { name: "Mira", birthday: "1983-03-23" },
      { name: "Aria", birthday: "2012-11-03" },
      { name: "Keit", birthday: "1933-05-14" },
      { name: "Tisha", birthday: "2012-11-03" },
    ]);
  });

  it("возвращает пустой массив для пустого входа", async () => {
    const getChildren = await loadFunction();
    expect(getChildren([])).toEqual([]);
  });
});
