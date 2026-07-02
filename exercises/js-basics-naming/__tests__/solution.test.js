import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-naming", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит количество комнат короля", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // Проверяется только результат на экране; именование — на совести ученика
    expect(lines).toEqual(["King Balon the 6th has 102 rooms."]);
  });
});
