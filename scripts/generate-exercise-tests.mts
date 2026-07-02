import { access, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadExerciseManifest } from "../packages/shared/src/exercise-manifest.ts";
import {
  generateExerciseTest,
  resolveExerciseTestKind,
  resolveGeneratedTestFilename,
  shouldSkipGeneratedTest,
} from "../packages/shared/src/exercise-test-generator.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exercisesRoot = path.join(repoRoot, "exercises");

const GENERATED_TEST_NAMES = new Set([
  "solution.test.js",
  "solution.test.ts",
  "exercise.test.js",
]);

const main = async () => {
  const entries = await readdir(exercisesRoot, { withFileTypes: true });
  let generated = 0;
  let skipped = 0;
  let placeholdersRemoved = 0;

  for (const entry of entries.filter((item) => item.isDirectory())) {
    const exerciseDir = path.join(exercisesRoot, entry.name);
    const manifest = await loadExerciseManifest(path.join(exerciseDir, "exercise.json"));
    const testsDir = path.join(exerciseDir, "__tests__");

    await rm(path.join(testsDir, "placeholder.test.js"), { force: true });
    placeholdersRemoved += 1;

    if (shouldSkipGeneratedTest(manifest)) {
      skipped += 1;
      continue;
    }

    // Задание с эталоном __solution__ ведётся руками (AGENTS.md «Тесты
    // заданий»): его тест написан вручную, генератором не перетирать
    const hasSolution = await access(path.join(exerciseDir, "__solution__"))
      .then(() => true)
      .catch(() => false);
    if (hasSolution) {
      skipped += 1;
      continue;
    }

    const kind = resolveExerciseTestKind(manifest);
    const testSource = generateExerciseTest(manifest);
    if (!testSource) {
      skipped += 1;
      continue;
    }

    const testFilename = resolveGeneratedTestFilename(kind);
    await writeFile(path.join(testsDir, testFilename), testSource, "utf8");

    const existingTests = await readdir(testsDir);
    await Promise.all(
      existingTests
        .filter(
          (filename) =>
            GENERATED_TEST_NAMES.has(filename) && filename !== testFilename,
        )
        .map((filename) => rm(path.join(testsDir, filename), { force: true })),
    );

    generated += 1;
  }

  console.log(
    `Generated ${generated} test file(s), skipped ${skipped}, removed ${placeholdersRemoved} placeholder(s)`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
