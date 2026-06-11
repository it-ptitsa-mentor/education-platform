import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  loadExerciseManifest,
  validateStudentFiles,
} from "@ptitsa/shared";

const execFileAsync = promisify(execFile);

export type ExerciseRunResult = {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export type RunExerciseCheckInput = {
  exercisesRoot: string;
  slug: string;
  studentFiles: Record<string, string>;
  timeoutMs?: number;
};

const EXERCISE_MANIFEST = "exercise.json";

export const runExerciseCheck = async ({
  exercisesRoot,
  slug,
  studentFiles,
  timeoutMs = 20_000,
}: RunExerciseCheckInput): Promise<ExerciseRunResult> => {
  const exerciseDir = path.join(exercisesRoot, slug);
  const manifest = await loadExerciseManifest(
    path.join(exerciseDir, EXERCISE_MANIFEST),
  );

  validateStudentFiles(manifest, studentFiles);

  const workDir = await mkdtemp(path.join(tmpdir(), `ptitsa-exercise-${slug}-`));

  try {
    await cp(exerciseDir, workDir, {
      recursive: true,
      filter: (source) =>
        !source.endsWith(EXERCISE_MANIFEST) &&
        !source.endsWith("vitest.config.js"),
    });

    await Promise.all(
      Object.entries(studentFiles).map(([filePath, content]) =>
        writeFile(path.join(workDir, filePath), content, "utf8"),
      ),
    );

    const repoRoot = path.dirname(exercisesRoot);
    const vitestCli = path.join(repoRoot, "node_modules", "vitest", "vitest.mjs");
    const vitestConfig = path.join(
      repoRoot,
      "packages",
      "runner",
      "vitest.exercise.config.ts",
    );

    try {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        [vitestCli, "run", "--config", vitestConfig, "--root", workDir],
        {
          cwd: repoRoot,
          timeout: timeoutMs,
          env: { ...process.env, NODE_ENV: "test" },
          maxBuffer: 4 * 1024 * 1024,
        },
      );

      return {
        passed: true,
        exitCode: 0,
        stdout,
        stderr,
      };
    } catch (error) {
      const execError = error as NodeJS.ErrnoException & {
        stdout?: string;
        stderr?: string;
        code?: number | string;
      };

      return {
        passed: false,
        exitCode: typeof execError.code === "number" ? execError.code : 1,
        stdout: execError.stdout ?? "",
        stderr: execError.stderr ?? String(error),
      };
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
};

export const readStarterFiles = async (
  exercisesRoot: string,
  slug: string,
): Promise<Record<string, string>> => {
  const manifest = await loadExerciseManifest(
    path.join(exercisesRoot, slug, EXERCISE_MANIFEST),
  );
  const exerciseDir = path.join(exercisesRoot, slug);

  const entries = await Promise.all(
    manifest.filesToOpen.map(async (filePath) => [
      filePath,
      await readFile(path.join(exerciseDir, filePath), "utf8"),
    ]),
  );

  return Object.fromEntries(entries);
};
