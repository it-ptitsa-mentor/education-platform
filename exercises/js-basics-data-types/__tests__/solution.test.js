import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-data-types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит число -0.304", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["-0.304"]);
  });
});
