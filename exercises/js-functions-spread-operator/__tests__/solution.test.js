import { describe, expect, it } from "vitest";

describe("js-functions-spread-operator", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
