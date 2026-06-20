import {
  runBrowserExerciseCheck,
  type ExerciseManifest,
} from "@ptitsa/shared/exercise-checks";
import type { CheckResult, ExerciseDetail, ExerciseSummary } from "./exercise-types";
import {
  staticExerciseSummaries,
  staticExercises,
} from "./generated/exercises-data";

const exerciseBySlug = new Map<string, (typeof staticExercises)[number]>(
  staticExercises.map((exercise) => [exercise.slug, exercise]),
);

const toManifest = (exercise: (typeof staticExercises)[number]): ExerciseManifest => ({
  slug: exercise.slug,
  title: exercise.title,
  language: exercise.language,
  filesToOpen: [...exercise.filesToOpen],
  studentFiles: [...exercise.studentFiles],
  readme: exercise.readme,
});

export const staticFetchExercises = async (): Promise<{
  exercises: ExerciseSummary[];
}> => ({
  exercises: staticExerciseSummaries.map((summary) => ({ ...summary })),
});

export const staticFetchExercise = async (slug: string): Promise<ExerciseDetail> => {
  const exercise = exerciseBySlug.get(slug);
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  return {
    slug: exercise.slug,
    title: exercise.title,
    language: exercise.language,
    filesToOpen: [...exercise.filesToOpen],
    readme: exercise.readme,
    files: { ...exercise.files },
  };
};

export const staticCheckExercise = async (
  slug: string,
  files: Record<string, string>,
): Promise<CheckResult> => {
  const exercise = exerciseBySlug.get(slug);
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const result = await runBrowserExerciseCheck(toManifest(exercise), files);
  return result;
};
