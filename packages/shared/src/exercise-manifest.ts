import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { ExerciseManifest } from "./exercise-manifest-types.js";

export type { ExerciseLanguage, ExerciseManifest } from "./exercise-manifest-types.js";
export { validateStudentFiles } from "./validate-student-files.js";

export const loadExerciseManifest = async (
  manifestPath: URL | string,
): Promise<ExerciseManifest> => {
  const resolvedPath =
    manifestPath instanceof URL ? fileURLToPath(manifestPath) : manifestPath;
  const raw = await readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(raw) as ExerciseManifest;

  if (!parsed.slug || !parsed.title || !parsed.language) {
    throw new Error("Invalid exercise manifest: missing required fields");
  }

  return parsed;
};
