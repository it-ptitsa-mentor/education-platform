import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-stdlib", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит тип константы motto", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["string"]);
  });
});
