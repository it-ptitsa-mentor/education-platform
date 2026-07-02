import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-variadic-parameters", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит минимальное из чисел 3, 10, 22, -3, 0", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["-3"]);
  });
});
