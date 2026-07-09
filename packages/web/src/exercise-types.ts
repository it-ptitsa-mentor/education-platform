import type { ExerciseLanguage, ExerciseTestClass } from "@ptitsa/shared";

export type ExerciseSummary = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  categoryId: string;
  categoryName: string;
  /** Defaults to 'missing' when served from the dynamic API (dev-only). */
  testClass?: ExerciseTestClass;
};

export type ExerciseDetail = {
  slug: string;
  title: string;
  language: string;
  filesToOpen: string[];
  readme: string;
  /** Defaults to 'missing' when served from the dynamic API (dev-only). */
  testClass?: ExerciseTestClass;
  /** Solution files — revealed only after "Я справился" for stub exercises. */
  solutionFiles?: Record<string, string>;
  files: Record<string, string>;
};

export type CheckResult = {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};
