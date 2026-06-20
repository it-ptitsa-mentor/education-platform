import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadExerciseManifest } from "../packages/shared/src/exercise-manifest.ts";
import { generateSolutionJsTest } from "../packages/shared/src/exercise-test-generator.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exercisesRoot = path.join(repoRoot, "exercises");

const CUSTOM_TESTS = new Set(["js-variables", "js-basics-variables"]);

const main = async () => {
  const entries = await readdir(exercisesRoot, { withFileTypes: true });
  let generated = 0;

  for (const entry of entries.filter((item) => item.isDirectory())) {
    const exerciseDir = path.join(exercisesRoot, entry.name);
    const manifest = await loadExerciseManifest(path.join(exerciseDir, "exercise.json"));

    if (manifest.language !== "javascript") continue;
    if (!manifest.studentFiles.includes("solution.js")) continue;
    if (CUSTOM_TESTS.has(manifest.slug)) continue;

    const testPath = path.join(exerciseDir, "__tests__/solution.test.js");
    const testSource = generateSolutionJsTest(manifest.slug, manifest.readme);

    await rm(path.join(exerciseDir, "__tests__/placeholder.test.js"), { force: true });
    await writeFile(testPath, testSource, "utf8");
    generated += 1;
  }

  console.log(`Generated ${generated} solution.js test(s)`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
