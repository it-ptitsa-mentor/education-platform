import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-interpolation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит вопрос с интерполированным именем", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["Do you want to eat, Arya?"]);
  });
});
