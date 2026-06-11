import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-variables", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("prints Dragon twice", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((value) => {
      lines.push(String(value));
    });

    await import("../solution.js");

    expect(lines).toEqual(["Dragon", "Dragon"]);
  });
});
