import { afterEach, describe, expect, it, vi } from "vitest";

const runWithRandom = async (value) => {
  const lines = [];
  vi.spyOn(Math, "random").mockReturnValue(value);
  vi.spyOn(console, "log").mockImplementation((...args) => {
    lines.push(args.map(String).join(" "));
  });
  await import("../solution.js");
  return lines;
};

describe("js-basics-deterministic", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит 10 при Math.random() близком к 1", async () => {
    const lines = await runWithRandom(0.9999);
    expect(lines).toEqual(["10"]);
  });

  it("выводит целое из середины диапазона", async () => {
    const lines = await runWithRandom(0.5);
    // 0.5 * 11 = 5.5 → floor → 5
    expect(lines).toEqual(["5"]);
  });

  it("выводит 0 при Math.random() = 0", async () => {
    const lines = await runWithRandom(0);
    expect(lines).toEqual(["0"]);
  });
});
