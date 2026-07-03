import { afterEach, describe, expect, it, vi } from "vitest";

const loadFunction = async () => {
  const mod = await import("../prime.js");
  const fn = mod.default ?? mod.sayPrimeOrNot;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию sayPrimeOrNot (export default)");
  }
  return fn;
};

describe("js-functions-pure-functions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("печатает yes для простых чисел", async () => {
    const sayPrimeOrNot = await loadFunction();
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    sayPrimeOrNot(5);
    sayPrimeOrNot(2);
    sayPrimeOrNot(13);
    expect(spy.mock.calls.map(([line]) => line)).toEqual(["yes", "yes", "yes"]);
  });

  it("печатает no для составных чисел и единицы", async () => {
    const sayPrimeOrNot = await loadFunction();
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    sayPrimeOrNot(4);
    sayPrimeOrNot(9);
    sayPrimeOrNot(1);
    expect(spy.mock.calls.map(([line]) => line)).toEqual(["no", "no", "no"]);
  });
});
