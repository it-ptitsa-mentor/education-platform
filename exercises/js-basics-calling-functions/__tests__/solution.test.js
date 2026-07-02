import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-calling-functions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит абсолютное значение fruitsCount", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // fruitsCount = -18 → Math.abs → 18
    expect(lines).toEqual(["18"]);
  });
});
