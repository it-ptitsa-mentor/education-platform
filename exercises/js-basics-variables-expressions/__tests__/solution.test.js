import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-variables-expressions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("переводит 100 евро в доллары и рубли", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // 100 евро * 1.25 = 125 долларов; 125 * 60 = 7500 рублей
    expect(lines).toEqual(["125", "7500"]);
  });
});
