import type { ExerciseManifest } from "./exercise-manifest-types.js";

export const validateStudentFiles = (
  manifest: ExerciseManifest,
  files: Record<string, string>,
): void => {
  const allowed = new Set(manifest.studentFiles);

  Object.keys(files).forEach((filePath) => {
    if (filePath.includes("..") || filePath.startsWith("/")) {
      throw new Error(`Path not allowed: ${filePath}`);
    }

    if (!allowed.has(filePath)) {
      throw new Error(`Path not allowed: ${filePath}`);
    }
  });
};
