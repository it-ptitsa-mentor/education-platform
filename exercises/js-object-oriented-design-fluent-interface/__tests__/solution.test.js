import { describe, expect, it } from "vitest";

describe("js-object-oriented-design-fluent-interface", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
