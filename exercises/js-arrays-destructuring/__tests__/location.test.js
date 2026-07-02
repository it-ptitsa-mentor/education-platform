import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../location.js");
  const fn = mod.getTheNearestLocation ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getTheNearestLocation");
  }
  return fn;
};

describe("js-arrays-destructuring", () => {
  it("находит ближайшее место к точке", async () => {
    const getTheNearestLocation = await loadFunction();
    const locations = [
      ["Park", [10, 5]],
      ["Sea", [1, 3]],
      ["Museum", [8, 4]],
    ];
    expect(getTheNearestLocation(locations, [5, 5])).toEqual([
      "Museum",
      [8, 4],
    ]);
  });

  it("возвращает null для пустого списка", async () => {
    const getTheNearestLocation = await loadFunction();
    expect(getTheNearestLocation([], [5, 5])).toBeNull();
  });

  it("возвращает единственное место", async () => {
    const getTheNearestLocation = await loadFunction();
    expect(getTheNearestLocation([["Home", [0, 0]]], [100, 100])).toEqual([
      "Home",
      [0, 0],
    ]);
  });
});
