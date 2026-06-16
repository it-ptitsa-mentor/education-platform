import { describe, expect, it } from "vitest";
import { checkJsVariables } from "./js-variables.js";

describe("checkJsVariables", () => {
  it("passes when solution prints Dragon twice", async () => {
    const result = await checkJsVariables(`
const x = "Dragon";
console.log(x);
console.log(x);
`);

    expect(result.passed).toBe(true);
    expect(result.exitCode).toBe(0);
  });

  it("fails when variable is missing", async () => {
    const result = await checkJsVariables(`
console.log(x);
console.log(x);
`);

    expect(result.passed).toBe(false);
    expect(result.stderr).toContain("x is not defined");
  });
});
