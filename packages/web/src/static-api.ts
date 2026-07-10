import { checkQuizAnswers } from "@ptitsa/shared/quiz-check";
import type { QuizManifest } from "@ptitsa/shared/quiz-manifest-types";
import {
  runBrowserExerciseCheck,
  type ExerciseManifest,
} from "@ptitsa/shared/exercise-checks";
import type { ExerciseLanguage, ExerciseTestClass } from "@ptitsa/shared";
import { isPristineStarter } from "./lib/pristine-starter";
import type { CheckResult, ExerciseDetail, ExerciseSummary } from "./exercise-types";
import type { QuizCheckResult, QuizDetail, QuizSummary } from "./quiz-types";
import {
  staticExerciseSummaries,
  staticExercises,
} from "./generated/exercises-data";
import quizDetails from "./generated/quiz-details.json";
import quizManifests from "./generated/quiz-manifests.json";
import quizSummaries from "./generated/quiz-summaries.json";

// The generated `staticExercises` is typed as a union of narrow literal
// object shapes (each exercise inferred `as const`), so optional fields like
// `testClass`/`solutionFiles` are absent from some members and even keyed
// access to `files` is rejected. Read entries through this stable shape.
type StaticExercise = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  filesToOpen: readonly string[];
  studentFiles: readonly string[];
  readme: string;
  testClass?: ExerciseTestClass;
  solutionFiles?: Record<string, string> | null;
  /** Pilot: HTML class names required in student's markup (from solution). */
  expectedClasses?: readonly string[];
  /** Pilot: CSS selectors required in student's CSS (delta solution–starter). */
  expectedSelectors?: readonly string[];
  files: Record<string, string>;
};

const staticQuizSummaries = quizSummaries as QuizSummary[];
const staticQuizzes = quizDetails as QuizDetail[];
const staticQuizManifests = quizManifests as QuizManifest[];

const exerciseBySlug = new Map<string, StaticExercise>(
  (staticExercises as readonly unknown[] as StaticExercise[]).map((exercise) => [
    exercise.slug,
    exercise,
  ]),
);

const toManifest = (exercise: StaticExercise): ExerciseManifest => ({
  slug: exercise.slug,
  title: exercise.title,
  language: exercise.language,
  filesToOpen: [...exercise.filesToOpen],
  studentFiles: [...exercise.studentFiles],
  readme: exercise.readme,
  ...(exercise.expectedClasses !== undefined && {
    expectedClasses: [...exercise.expectedClasses],
  }),
  ...(exercise.expectedSelectors !== undefined && {
    expectedSelectors: [...exercise.expectedSelectors],
  }),
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
    solutionFiles: exercise.solutionFiles
      ? { ...exercise.solutionFiles }
      : undefined,
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

  if (isPristineStarter(exercise.files, files, exercise.studentFiles)) {
    return {
      passed: false,
      exitCode: 1,
      stdout: "",
      stderr:
        "Стартовый код не изменён — впишите решение в редакторе и запустите снова.",
    };
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
