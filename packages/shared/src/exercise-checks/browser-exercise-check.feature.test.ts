import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadExerciseManifest } from "../exercise-manifest.js";
import { runBrowserExerciseCheck } from "./browser-exercise-check.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const exercisesRoot = path.join(repoRoot, "exercises");

const readStarterFiles = async (slug: string) => {
  const manifest = await loadExerciseManifest(
    path.join(exercisesRoot, slug, "exercise.json"),
  );

  const entries = await Promise.all(
    manifest.filesToOpen.map(async (filePath) => [
      filePath,
      await readFile(path.join(exercisesRoot, slug, filePath), "utf8"),
    ]),
  );

  return Object.fromEntries(entries);
};

describe("browser exercise check integration", () => {
  it("passes starter files for a multi-file jsx exercise", async () => {
    const slug = "js-redux-toolkit-slices";
    const manifest = await loadExerciseManifest(
      path.join(exercisesRoot, slug, "exercise.json"),
    );
    const studentFiles = await readStarterFiles(slug);

    const result = await runBrowserExerciseCheck(manifest, studentFiles);

    expect(result.passed).toBe(true);
  });

  it("fails when a jsx component export is removed", async () => {
    const slug = "js-redux-toolkit-slices";
    const manifest = await loadExerciseManifest(
      path.join(exercisesRoot, slug, "exercise.json"),
    );
    const studentFiles = await readStarterFiles(slug);

    const result = await runBrowserExerciseCheck(manifest, {
      ...studentFiles,
      "src/components/Comment.jsx": "export default 1;",
    });

    expect(result.passed).toBe(false);
    expect(result.stderr).toMatch(/Comment\.jsx/);
  });
});
