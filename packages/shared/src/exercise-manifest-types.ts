export type ExerciseLanguage = "javascript";

export type ExerciseManifest = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  filesToOpen: string[];
  studentFiles: string[];
  readme: string;
};
