import { describe, expect, it } from "vitest";

describe("js-introduction-to-oop-constructor", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
