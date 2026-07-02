import { afterEach, describe, expect, it, vi } from "vitest";

describe("js-basics-call-function-expression-ercise", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("выводит первую и последнюю буквы текста в нужном формате", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((...args) => {
      lines.push(args.map(String).join(" "));
    });

    await import("../solution.js");

    // Допускаем как один console.log с \n, так и два вызова
    expect(lines.join("\n")).toBe("First: N\nLast: t");
  });
});
