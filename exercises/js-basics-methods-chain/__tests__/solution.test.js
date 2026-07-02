import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-methods-chain", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит длину подстроки после slice и replace", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // ' you lik' (символы 6–13) → ' someone lik' → длина 12
    expect(lines).toEqual(["12"]);
  });
});
