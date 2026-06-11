import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runExerciseCheck } from "./run-exercise.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("runExerciseCheck", () => {
  it("passes when student fixes undeclared variable", async () => {
    const result = await runExerciseCheck({
      exercisesRoot: path.join(repoRoot, "exercises"),
      slug: "js-variables",
      studentFiles: {
        "solution.js": `const pet = "Dragon";
console.log(pet);
console.log(pet);
`,
      },
    });

    expect(result.exitCode).toBe(0);
    expect(result.passed).toBe(true);
    expect(result.stdout).toMatch(/passed|✓|PASS/i);
    expect(result.stderr).not.toMatch(/vitest\/config/i);
  });

  it("fails when solution still references undeclared variable", async () => {
    const result = await runExerciseCheck({
      exercisesRoot: path.join(repoRoot, "exercises"),
      slug: "js-variables",
      studentFiles: {
        "solution.js": `console.log("Dragon");
console.log(unknown);
`,
      },
    });

    expect(result.passed).toBe(false);
    expect(result.exitCode).not.toBe(0);
  });
});
