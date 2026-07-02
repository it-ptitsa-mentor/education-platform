import { describe, expect, it } from "vitest";

describe("js-basics-errors", () => {
  it("код содержит синтаксическую ошибку", async () => {
    // Задание — сломать код: модуль не должен импортироваться
    await expect(import("../solution.js")).rejects.toThrow();
  });
});
