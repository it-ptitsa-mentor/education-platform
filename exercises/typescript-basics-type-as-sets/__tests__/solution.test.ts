import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("typescript-basics-type-as-sets: CustomType", () => {
  it("solution file exports CustomType definition", () => {
    const fileContent = fs.readFileSync(
      path.resolve(__dirname, "../solution.ts"),
      "utf-8"
    );
    expect(fileContent).toMatch(/export\s+type\s+CustomType\s*=/);
    expect(fileContent).toMatch(/null/);
    expect(fileContent).toMatch(/undefined/);
    expect(fileContent).toMatch(/number/);
  });
});
