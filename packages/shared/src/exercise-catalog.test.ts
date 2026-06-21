import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadExerciseManifest } from "./exercise-manifest.js";
import {
  shouldSkipGeneratedTest,
  usesStudentAuthoredTests,
} from "./exercise-test-generator.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const exercisesRoot = path.join(repoRoot, "exercises");

const VITEST_FILE = /\.test\.(js|ts)$/;

const listExerciseSlugs = async () => {
  const entries = await readdir(exercisesRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
};

const listTestFiles = async (slug: string) => {
  const testsDir = path.join(exercisesRoot, slug, "__tests__");
  try {
    return await readdir(testsDir);
  } catch {
    return [];
  }
};

describe("exercise catalog test coverage", () => {
  it("gives every exercise a vitest-discoverable test file", async () => {
    const slugs = await listExerciseSlugs();
    const missing = await Promise.all(
      slugs.map(async (slug) => {
        const manifest = await loadExerciseManifest(
          path.join(exercisesRoot, slug, "exercise.json"),
        );
        const testFiles = await listTestFiles(slug);
        const hasVitestFile = testFiles.some((file) => VITEST_FILE.test(file));
        const hasStudentTestSource =
          usesStudentAuthoredTests(manifest) &&
          testFiles.some((file) => manifest.studentFiles.includes(`__tests__/${file}`));

        if (hasVitestFile || hasStudentTestSource) {
          return null;
        }

        return slug;
      }),
    );

    expect(missing.filter((slug): slug is string => slug !== null)).toEqual([]);
  });

  it("does not keep placeholder tests after generation", async () => {
    const slugs = await listExerciseSlugs();
    const placeholders = (
      await Promise.all(
        slugs.map(async (slug) => {
          const testFiles = await listTestFiles(slug);
          return testFiles.includes("placeholder.test.js") ? slug : null;
        }),
      )
    ).filter((slug): slug is string => slug !== null);

    expect(placeholders).toEqual([]);
  });

  it("skips only custom and student-authored exercises in generator", async () => {
    const slugs = await listExerciseSlugs();
    const skipped = (
      await Promise.all(
        slugs.map(async (slug) => {
          const manifest = await loadExerciseManifest(
            path.join(exercisesRoot, slug, "exercise.json"),
          );
          return shouldSkipGeneratedTest(manifest) ? slug : null;
        }),
      )
    ).filter((slug): slug is string => slug !== null);

    expect(skipped).toHaveLength(18);
    expect(skipped).toContain("js-variables");
    expect(skipped).toContain("js-testing-tdd");
    expect(skipped).toContain("js-advanced-testing-monkey-patching");
  });
});
