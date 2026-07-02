import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../superseries.js");
  const fn = mod.default ?? mod.getSuperSeriesWinner;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-nested-arrays", () => {
  it("определяет победителя суперсерии по числу побед", async () => {
    const getSuperSeriesWinner = await loadFunction();
    const scores = [
      [3, 7],
      [4, 1],
      [4, 4],
      [3, 5],
      [4, 5],
      [3, 2],
      [4, 3],
      [6, 5],
    ];
    expect(getSuperSeriesWinner(scores)).toBe("canada");
  });

  it("возвращает ussr когда у СССР больше побед", async () => {
    const getSuperSeriesWinner = await loadFunction();
    expect(
      getSuperSeriesWinner([
        [1, 2],
        [0, 3],
        [5, 4],
      ]),
    ).toBe("ussr");
  });

  it("возвращает null при ничьей", async () => {
    const getSuperSeriesWinner = await loadFunction();
    expect(
      getSuperSeriesWinner([
        [1, 2],
        [2, 1],
        [3, 3],
      ]),
    ).toBeNull();
  });
});
