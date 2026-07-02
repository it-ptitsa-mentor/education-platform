import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-strings", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит диалог одним console.log с переводом строки и литеральным \\n", async () => {
    const calls = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      calls.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    expect(calls).toEqual([
      '- Did Joffrey agree?\n- He did. He also said "I love using \\n".',
    ]);
  });
});
