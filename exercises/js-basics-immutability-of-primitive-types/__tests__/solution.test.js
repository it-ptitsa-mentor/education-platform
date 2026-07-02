import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-immutability-of-primitive-types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("составляет слово из символов трёх фамилий", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // Lannister[2] + Targaryen[1] + Martell[3] + Targaryen[4] + Targaryen[2]
    expect(lines).toEqual(["natar"]);
  });
});
