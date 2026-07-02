import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-properties-methods", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит имя без пробельных символов по краям", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["Vasilii"]);
  });
});
