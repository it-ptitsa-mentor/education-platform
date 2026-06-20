import { describe, expect, it } from "vitest";

describe("js-object-oriented-design-configuration-setters", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
