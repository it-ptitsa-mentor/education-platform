import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { readStarterFiles, runExerciseCheck } from "./run-exercise.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const exercisesRoot = path.join(repoRoot, "exercises");

const STARTER_SMOKE_SLUGS = [
  "js-basics-hello-world",
  "js-basics-arithmetics",
  "css-flex-container",
  "cli-basics-navigation",
  "js-arrays-syntax",
  "js-react-component",
] as const;

describe("generated exercise tests", () => {
  it("does not leave placeholder tests in catalog", async () => {
    const entries = await readdir(exercisesRoot, { withFileTypes: true });
    const placeholders = (
      await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map(async (entry) => {
            const testsDir = path.join(exercisesRoot, entry.name, "__tests__");
            try {
              const files = await readdir(testsDir);
              return files.includes("placeholder.test.js") ? entry.name : null;
            } catch {
              return null;
            }
          }),
      )
    ).filter((slug): slug is string => slug !== null);

    expect(placeholders).toEqual([]);
  });

  it("passes starter checks for representative generated tests", async () => {
    const results = await Promise.all(
      STARTER_SMOKE_SLUGS.map(async (slug) => {
        const studentFiles = await readStarterFiles(exercisesRoot, slug);
        const result = await runExerciseCheck({
          exercisesRoot,
          slug,
          studentFiles,
        });

        return { slug, passed: result.passed, stderr: result.stderr };
      }),
    );

    expect(results.filter((item) => !item.passed)).toEqual([]);
  }, 120_000);
});
