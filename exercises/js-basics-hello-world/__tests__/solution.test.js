import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-hello-world", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("prints expected console output from readme", async () => {
    const lines: string[] = [];
    vi.spyOn(console, "log").mockImplementation((value) => {
      lines.push(String(value));
    });

    await import("../solution.js");

    expect(lines).toEqual(["Hello, World!"]);
  });
});
