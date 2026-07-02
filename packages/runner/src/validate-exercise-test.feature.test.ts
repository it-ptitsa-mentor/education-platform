import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  readSolutionFiles,
  validateExerciseTest,
} from "./validate-exercise-test.js";

const exercisesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../exercises",
);

describe("validateExerciseTest", () => {
  it("validates js-variables: solution passes, buggy starter fails", async () => {
    const result = await validateExerciseTest({
      exercisesRoot,
      slug: "js-variables",
    });

    expect(result.status).toBe("validated");
  });

  it("flags starter-passes for typed exercise (starter == solution)", async () => {
    const result = await validateExerciseTest({
      exercisesRoot,
      slug: "js-basics-hello-world",
    });

    expect(result.status).toBe("starter-passes");
  });

  it("returns no-solution when __solution__ is absent", async () => {
    const result = await validateExerciseTest({
      exercisesRoot,
      slug: "js-basics-arithmetics",
    });

    expect(result.status).toBe("no-solution");
  });
});

describe("readSolutionFiles", () => {
  it("returns null without __solution__ dir", async () => {
    await expect(
      readSolutionFiles(exercisesRoot, "js-basics-arithmetics"),
    ).resolves.toBeNull();
  });

  it("reads solution files for seeded exercise", async () => {
    const files = await readSolutionFiles(exercisesRoot, "js-variables");
    expect(files).not.toBeNull();
    expect(files?.["solution.js"]).toContain("Dragon");
  });
});
