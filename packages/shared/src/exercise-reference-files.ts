import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const excludedDirectories = new Set([
  "tests", "solution", "hexlet", "__tests__", "__solution__", "__hexlet__",
]);

/** Supporting sources only: never follow symlinks or expose tests/answers. */
export const readReferenceFiles = async (
  exerciseDir: string,
  studentFiles: readonly string[],
): Promise<Record<string, string>> => {
  const studentPaths = new Set(studentFiles.map((file) => path.posix.normalize(file)));
  const files: Record<string, string> = {};
  const visit = async (relativeDir: string): Promise<void> => {
    const entries = await readdir(path.join(exerciseDir, relativeDir), { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = path.posix.join(relativeDir, entry.name);
      if (entry.isDirectory()) {
        if (!excludedDirectories.has(entry.name)) await visit(relative);
      } else if (entry.isFile() && entry.name !== "exercise.json" && !studentPaths.has(relative)) {
        files[relative] = await readFile(path.join(exerciseDir, relative), "utf8");
      }
    }
  };
  await visit("");
  return files;
};
