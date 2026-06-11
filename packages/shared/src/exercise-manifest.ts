import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export type ExerciseLanguage = "javascript";

export type ExerciseManifest = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  filesToOpen: string[];
  studentFiles: string[];
  readme: string;
};

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
