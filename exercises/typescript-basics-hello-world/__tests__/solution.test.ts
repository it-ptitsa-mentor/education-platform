import { afterEach, describe, expect, it, vi } from "vitest";

describe("typescript-basics-hello-world", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("prints expected console output from readme", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((value) => {
      lines.push(String(value));
    });

    await import("../solution.ts");

    expect(lines).toEqual(["Hello, World!"]);
  });
});
