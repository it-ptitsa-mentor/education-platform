import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-arithmetics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит значения четырёх выражений по одному на строку", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // 3^5, -8/-4, 100%3 и их сумма
    expect(lines).toEqual(["243", "2", "1", "246"]);
  });
});
