import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-signature", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит округление number вверх через Math.ceil", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // number = 10.34 → Math.ceil → 11
    expect(lines).toEqual(["11"]);
  });
});
