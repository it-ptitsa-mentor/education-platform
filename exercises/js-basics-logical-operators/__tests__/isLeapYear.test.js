import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../isLeapYear.js");
  const fn = mod.default ?? mod.isLeapYear;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию isLeapYear (export default)");
  }
  return fn;
};

describe("js-basics-logical-operators", () => {
  it("распознаёт обычные високосные годы (кратны 4, не кратны 100)", async () => {
    const isLeapYear = await loadFunction();
    expect(isLeapYear(2016)).toBe(true);
    expect(isLeapYear(2024)).toBe(true);
  });

  it("отклоняет невисокосные годы", async () => {
    const isLeapYear = await loadFunction();
    expect(isLeapYear(2017)).toBe(false);
    expect(isLeapYear(2018)).toBe(false);
  });

  it("учитывает правила кратности 100 и 400", async () => {
    const isLeapYear = await loadFunction();
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });
});
