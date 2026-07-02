import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../dates.js");
  const fn = mod.getWeekends ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getWeekends");
  }
  return fn;
};

describe("js-arrays-syntax", () => {
  it("возвращает полные названия по умолчанию и для long", async () => {
    const getWeekends = await loadFunction();
    expect(getWeekends()).toEqual(["saturday", "sunday"]);
    expect(getWeekends("long")).toEqual(["saturday", "sunday"]);
  });

  it("возвращает короткие названия для short", async () => {
    const getWeekends = await loadFunction();
    expect(getWeekends("short")).toEqual(["sat", "sun"]);
  });
});
