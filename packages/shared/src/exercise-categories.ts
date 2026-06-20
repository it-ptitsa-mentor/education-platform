import type { ExerciseLanguage, ExerciseManifest } from "./exercise-manifest-types.js";

export type ExerciseCategoryMeta = {
  categoryId: string;
  categoryName: string;
};

const LANGUAGE_LABELS: Record<ExerciseLanguage, string> = {
  javascript: "JavaScript",
  html: "HTML / CSS",
  shell: "Shell / CLI",
};

export const resolveExerciseCategory = (
  manifest: Pick<ExerciseManifest, "language" | "hexlet" | "slug">,
): ExerciseCategoryMeta => {
  if (manifest.hexlet) {
    return {
      categoryId: manifest.hexlet.courseSlug,
      categoryName: manifest.hexlet.courseName,
    };
  }

  return {
    categoryId: manifest.language,
    categoryName: LANGUAGE_LABELS[manifest.language] ?? manifest.language,
  };
};

export type CategorizedExerciseSummary = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  categoryId: string;
  categoryName: string;
};

export const toCategorizedExerciseSummary = (
  manifest: Pick<ExerciseManifest, "slug" | "title" | "language" | "hexlet">,
): CategorizedExerciseSummary => ({
  slug: manifest.slug,
  title: manifest.title,
  language: manifest.language,
  ...resolveExerciseCategory(manifest),
});

export type ExerciseCategoryGroup = {
  id: string;
  name: string;
  exercises: CategorizedExerciseSummary[];
};

export const groupExercisesByCategory = (
  exercises: CategorizedExerciseSummary[],
): ExerciseCategoryGroup[] => {
  const groups = new Map<string, ExerciseCategoryGroup>();

  exercises.forEach((exercise) => {
    const existing = groups.get(exercise.categoryId);
    if (existing) {
      existing.exercises.push(exercise);
      return;
    }

    groups.set(exercise.categoryId, {
      id: exercise.categoryId,
      name: exercise.categoryName,
      exercises: [exercise],
    });
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      exercises: [...group.exercises].sort((a, b) =>
        a.title.localeCompare(b.title, "ru"),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
};
