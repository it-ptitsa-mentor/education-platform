import { describe, expect, it } from "vitest";

describe("typescript-basics-interface-implementation", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.ts")).resolves.toBeDefined();
  });
});
