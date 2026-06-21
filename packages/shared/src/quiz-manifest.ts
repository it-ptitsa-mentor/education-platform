import { readFile } from "node:fs/promises";
import type { QuizManifest } from "./quiz-manifest-types.js";
import { toPublicQuizDetail } from "./quiz-check.js";
import type { CategorizedExerciseSummary } from "./exercise-categories.js";

export const loadQuizManifest = async (manifestPath: string): Promise<QuizManifest> => {
  const raw = await readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw) as QuizManifest;

  if (!parsed.slug || !parsed.title || !Array.isArray(parsed.questions)) {
    throw new Error(`Invalid quiz manifest: ${manifestPath}`);
  }

  return parsed;
};

export const toCategorizedQuizSummary = (
  manifest: QuizManifest,
): CategorizedExerciseSummary => ({
  slug: manifest.slug,
  title: manifest.title,
  language: "javascript",
  categoryId: manifest.hexlet?.courseSlug ?? "quizzes",
  categoryName: manifest.hexlet?.courseName ?? "Квизы",
});

export const toPublicQuizManifest = (manifest: QuizManifest) =>
  toPublicQuizDetail(manifest);
