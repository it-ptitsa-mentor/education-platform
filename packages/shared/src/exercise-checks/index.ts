import { validateStudentFiles } from "../validate-student-files.js";
import type { ExerciseManifest } from "../exercise-manifest-types.js";
import { checkJsVariables, type ExerciseCheckOutcome } from "./js-variables.js";

export type { ExerciseCheckOutcome } from "./js-variables.js";
export type { ExerciseManifest } from "../exercise-manifest-types.js";

const checksBySlug: Record<
  string,
  (files: Record<string, string>) => Promise<ExerciseCheckOutcome>
> = {
  "js-variables": async (files) => checkJsVariables(files["solution.js"] ?? ""),
};

export const runBrowserExerciseCheck = async (
  manifest: ExerciseManifest,
  studentFiles: Record<string, string>,
): Promise<ExerciseCheckOutcome> => {
  validateStudentFiles(manifest, studentFiles);

  const check = checksBySlug[manifest.slug];
  if (!check) {
    throw new Error(`No browser check registered for: ${manifest.slug}`);
  }

  return check(studentFiles);
};
