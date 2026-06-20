import { describe, expect, it } from "vitest";

describe("js-basics-immutability-of-primitive-types", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
