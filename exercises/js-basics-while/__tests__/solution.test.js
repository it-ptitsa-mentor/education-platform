import { afterEach, describe, expect, it, vi } from "vitest";

const loadFunction = async () => {
  const mod = await import("../solution.js");
  const fn = mod.default ?? mod.printNumbers;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию printNumbers (export default)");
  }
  return fn;
};

describe("js-basics-while", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит числа в обратном порядке и finished!", async () => {
    const printNumbers = await loadFunction();
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    printNumbers(4);
    expect(lines).toEqual(["4", "3", "2", "1", "finished!"]);
  });

  it("работает с другой верхней границей", async () => {
    const printNumbers = await loadFunction();
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    printNumbers(2);
    expect(lines).toEqual(["2", "1", "finished!"]);
  });
});
