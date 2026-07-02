import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-instructions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит три имени, каждое отдельным console.log", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(lines).toEqual(["Robert", "Stannis", "Renly"]);
  });
});
