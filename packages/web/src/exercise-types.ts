export type ExerciseSummary = { slug: string; title: string };

export type ExerciseDetail = {
  slug: string;
  title: string;
  language: string;
  filesToOpen: string[];
  readme: string;
  files: Record<string, string>;
};

export type CheckResult = {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};
