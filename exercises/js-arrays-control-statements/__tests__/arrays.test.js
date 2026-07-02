import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.getTotalAmount;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-control-statements", () => {
  it("суммирует купюры указанной валюты", async () => {
    const getTotalAmount = await loadFunction();
    expect(
      getTotalAmount(["eur 10", "usd 1", "usd 10", "rub 50", "usd 5"], "usd"),
    ).toBe(16);
    expect(
      getTotalAmount(
        ["eur 10", "usd 1", "eur 5", "rub 100", "eur 20", "eur 100", "rub 200"],
        "eur",
      ),
    ).toBe(135);
    expect(
      getTotalAmount(
        ["eur 10", "rub 50", "eur 5", "rub 10", "rub 10", "eur 100", "rub 200"],
        "rub",
      ),
    ).toBe(270);
  });

  it("возвращает 0 если валюты нет в кошельке", async () => {
    const getTotalAmount = await loadFunction();
    expect(getTotalAmount(["eur 10"], "usd")).toBe(0);
    expect(getTotalAmount([], "usd")).toBe(0);
  });
});
