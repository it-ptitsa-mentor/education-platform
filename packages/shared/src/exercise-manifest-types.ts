export type ExerciseLanguage = "javascript" | "html" | "shell";

export type ExerciseManifest = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  filesToOpen: string[];
  studentFiles: string[];
  readme: string;
  hexlet?: {
    courseSlug: string;
    courseName: string;
    lessonSlug: string;
    lessonName: string;
    exerciseSlug: string;
    sourceUrl: string;
  };
};
