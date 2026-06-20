import { describe, expect, it } from "vitest";

describe("js-basics-data-types", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
