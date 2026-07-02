import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-symbols", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит последний символ константы word", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // word = 'Winterfell' → последний символ 'l'
    expect(lines).toEqual(["l"]);
  });
});
