import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadExerciseManifest } from "@ptitsa/shared";
import { runExerciseCheck, type ExerciseRunResult } from "./run-exercise.js";

export const SOLUTION_DIR = "__solution__";

/**
 * Результат валидации теста задания против эталонного решения:
 * - validated — тест проходит на эталоне и падает на стартере (норма);
 * - starter-passes — тест проходит и на стартере: слабый тест либо
 *   «наберите код» задание, где стартер совпадает с решением;
 * - solution-fails — тест падает на эталоне: сломан тест или эталон;
 * - no-solution — эталона `__solution__/` нет, валидировать нечего.
 */
export type ExerciseValidationStatus =
  | "validated"
  | "starter-passes"
  | "solution-fails"
  | "no-solution";

export type ExerciseValidationResult = {
  slug: string;
  status: ExerciseValidationStatus;
  solutionRun?: ExerciseRunResult;
  starterRun?: ExerciseRunResult;
};

const readFileOrNull = async (filePath: string): Promise<string | null> => {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
};

/**
 * Эталон: `exercises/{slug}/__solution__/<путь studentFile>`.
 * Возвращает null, если каталога нет; бросает, если эталон есть,
 * но покрывает не все studentFiles (недописанный эталон хуже отсутствующего).
 */
export const readSolutionFiles = async (
  exercisesRoot: string,
  slug: string,
): Promise<Record<string, string> | null> => {
  const manifest = await loadExerciseManifest(
    path.join(exercisesRoot, slug, "exercise.json"),
  );
  const solutionRoot = path.join(exercisesRoot, slug, SOLUTION_DIR);

  const entries = await Promise.all(
    manifest.studentFiles.map(async (filePath) => ({
      filePath,
      content: await readFileOrNull(path.join(solutionRoot, filePath)),
    })),
  );

  const found = entries.filter((entry) => entry.content !== null);
  if (found.length === 0) {
    return null;
  }
  if (found.length < entries.length) {
    const missing = entries
      .filter((entry) => entry.content === null)
      .map((entry) => entry.filePath);
    throw new Error(
      `${slug}: __solution__ не покрывает studentFiles: ${missing.join(", ")}`,
    );
  }

  return Object.fromEntries(
    entries.map(({ filePath, content }) => [filePath, content ?? ""]),
  );
};

const readStarterFilesOrEmpty = async (
  exercisesRoot: string,
  slug: string,
): Promise<Record<string, string>> => {
  const manifest = await loadExerciseManifest(
    path.join(exercisesRoot, slug, "exercise.json"),
  );
  const exerciseDir = path.join(exercisesRoot, slug);

  const entries = await Promise.all(
    manifest.studentFiles.map(async (filePath) => [
      filePath,
      (await readFileOrNull(path.join(exerciseDir, filePath))) ?? "",
    ]),
  );

  return Object.fromEntries(entries);
};

export const validateExerciseTest = async ({
  exercisesRoot,
  slug,
  timeoutMs,
}: {
  exercisesRoot: string;
  slug: string;
  timeoutMs?: number;
}): Promise<ExerciseValidationResult> => {
  const solutionFiles = await readSolutionFiles(exercisesRoot, slug);
  if (!solutionFiles) {
    return { slug, status: "no-solution" };
  }

  const solutionRun = await runExerciseCheck({
    exercisesRoot,
    slug,
    studentFiles: solutionFiles,
    timeoutMs,
  });
  if (!solutionRun.passed) {
    return { slug, status: "solution-fails", solutionRun };
  }

  const starterFiles = await readStarterFilesOrEmpty(exercisesRoot, slug);
  const starterRun = await runExerciseCheck({
    exercisesRoot,
    slug,
    studentFiles: starterFiles,
    timeoutMs,
  });

  return {
    slug,
    status: starterRun.passed ? "starter-passes" : "validated",
    solutionRun,
    starterRun,
  };
};
