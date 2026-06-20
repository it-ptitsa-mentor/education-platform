import { describe, expect, it } from "vitest";

describe("js-basics-variables-expressions", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
