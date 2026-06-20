import { describe, expect, it } from "vitest";

describe("js-basics-instructions", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
