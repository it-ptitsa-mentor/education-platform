export type ExerciseLanguage = "javascript" | "html" | "shell";

export type ExerciseManifest = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  filesToOpen: string[];
  studentFiles: string[];
  readme: string;
  /**
   * HTML class names that must appear in the student's HTML files.
   * Extracted from the solution HTML at generation time (pilot: select exercises).
   */
  expectedClasses?: string[];
  /**
   * CSS selectors that must appear in the student's CSS files.
   * Computed as delta: solution selectors minus starter selectors.
   */
  expectedSelectors?: string[];
  /**
   * CSS property names that must appear in the student's CSS files.
   * Computed as delta: solution property names minus starter property names.
   * More specific than expectedSelectors: verifies that required declarations
   * (e.g. font-family, background-image) are actually present, not just selector names.
   * May include custom properties (e.g. "--primary-color").
   */
  expectedDeclarations?: string[];
  hexlet?: {
    courseSlug: string;
    courseName: string;
    lessonSlug: string;
    lessonName: string;
    exerciseSlug: string;
    sourceUrl: string;
  };
};
