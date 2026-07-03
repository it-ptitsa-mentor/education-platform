import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../groupBy.js");
  const fn = mod.default ?? mod.groupBy;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию groupBy (export default)");
  }
  return fn;
};

const students = [
  { name: "Tirion", class: "B", mark: 3 },
  { name: "Keit", class: "A", mark: 3 },
  { name: "Ramsey", class: "A", mark: 4 },
];

describe("js-functions-reduce", () => {
  it("группирует объекты по свойству", async () => {
    const groupBy = await loadFunction();
    expect(groupBy(students, "mark")).toEqual({
      3: [
        { name: "Tirion", class: "B", mark: 3 },
        { name: "Keit", class: "A", mark: 3 },
      ],
      4: [{ name: "Ramsey", class: "A", mark: 4 }],
    });
    expect(groupBy(students, "class")).toEqual({
      A: [
        { name: "Keit", class: "A", mark: 3 },
        { name: "Ramsey", class: "A", mark: 4 },
      ],
      B: [{ name: "Tirion", class: "B", mark: 3 }],
    });
  });

  it("возвращает пустой объект для пустого массива", async () => {
    const groupBy = await loadFunction();
    expect(groupBy([], "")).toEqual({});
  });
});
