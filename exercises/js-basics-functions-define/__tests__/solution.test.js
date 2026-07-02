import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-functions-define", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("printMotto выводит Winter is coming", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    const mod = await import("../solution.js");
    const printMotto = mod.default ?? mod.printMotto;
    if (typeof printMotto !== "function") {
      throw new Error("Экспортируйте функцию printMotto (export default)");
    }

    printMotto();
    expect(lines).toEqual(["Winter is coming"]);
  });
});
