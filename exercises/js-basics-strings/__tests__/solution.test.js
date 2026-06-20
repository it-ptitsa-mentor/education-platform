import { describe, expect, it } from "vitest";

describe("js-basics-strings", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
