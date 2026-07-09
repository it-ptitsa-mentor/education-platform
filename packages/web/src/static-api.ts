import { checkQuizAnswers } from "@ptitsa/shared/quiz-check";
import type { QuizManifest } from "@ptitsa/shared/quiz-manifest-types";
import {
  runBrowserExerciseCheck,
  type ExerciseManifest,
} from "@ptitsa/shared/exercise-checks";
import type { CheckResult, ExerciseDetail, ExerciseSummary } from "./exercise-types";
import type { QuizCheckResult, QuizDetail, QuizSummary } from "./quiz-types";
import {
  staticExerciseSummaries,
  staticExercises,
} from "./generated/exercises-data";
import quizDetails from "./generated/quiz-details.json";
import quizManifests from "./generated/quiz-manifests.json";
import quizSummaries from "./generated/quiz-summaries.json";

const staticQuizSummaries = quizSummaries as QuizSummary[];
const staticQuizzes = quizDetails as QuizDetail[];
const staticQuizManifests = quizManifests as QuizManifest[];

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
    testClass: exercise.testClass,
    solutionFiles: exercise.solutionFiles ? { ...exercise.solutionFiles } : undefined,
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

export const staticFetchQuizzes = async (): Promise<{ quizzes: QuizSummary[] }> => ({
  quizzes: staticQuizSummaries.map((summary) => ({ ...summary })),
});

export const staticFetchQuiz = async (slug: string): Promise<QuizDetail> => {
  const quiz = staticQuizzes.find((item) => item.slug === slug);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  return {
    slug: quiz.slug,
    title: quiz.title,
    questions: quiz.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    })),
  };
};

export const staticCheckQuiz = async (
  slug: string,
  answers: Record<string, string[]>,
): Promise<QuizCheckResult> => {
  const manifest = staticQuizManifests.find((item) => item.slug === slug);
  if (!manifest) {
    throw new Error("Quiz not found");
  }

  return checkQuizAnswers(manifest, { answers });
};
