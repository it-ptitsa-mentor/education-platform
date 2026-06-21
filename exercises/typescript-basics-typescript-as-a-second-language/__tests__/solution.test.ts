import { describe, expect, it } from "vitest";

describe("typescript-basics-typescript-as-a-second-language", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.ts")).resolves.toBeDefined();
  });
});
