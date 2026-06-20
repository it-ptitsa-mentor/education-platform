import type { ExerciseLanguage } from "./exercise-manifest-types.js";

export type ExerciseTrackId = "javascript" | "react" | "html-css";

export type TrackExerciseSummary = {
  slug: string;
  title: string;
  language: ExerciseLanguage;
  categoryId: string;
  categoryName: string;
};

export const EXERCISE_TRACKS: ReadonlyArray<{
  id: ExerciseTrackId;
  label: string;
}> = [
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "html-css", label: "HTML + CSS" },
];

const REACT_COURSE_SLUGS = new Set(["js-react", "js-redux-toolkit"]);

const HTML_CSS_COURSE_SLUGS = new Set([
  "css-content",
  "css-flex",
  "css-positioning",
  "css-grid",
  "layout-designer-basics",
]);

export const resolveExerciseTrack = (
  exercise: Pick<TrackExerciseSummary, "language" | "categoryId">,
): ExerciseTrackId | null => {
  if (REACT_COURSE_SLUGS.has(exercise.categoryId)) {
    return "react";
  }

  if (
    HTML_CSS_COURSE_SLUGS.has(exercise.categoryId) ||
    exercise.language === "html"
  ) {
    return "html-css";
  }

  if (exercise.language === "javascript") {
    return "javascript";
  }

  return null;
};

export const filterExercisesByTrack = <T extends TrackExerciseSummary>(
  exercises: T[],
  trackId: ExerciseTrackId,
): T[] =>
  exercises.filter((exercise) => resolveExerciseTrack(exercise) === trackId);

export const sortExercisesForCatalog = <T extends TrackExerciseSummary>(
  exercises: T[],
): T[] =>
  [...exercises].sort(
    (a, b) =>
      a.categoryName.localeCompare(b.categoryName, "ru") ||
      a.title.localeCompare(b.title, "ru"),
  );

export type PaginatedItems<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export const paginateItems = <T>(
  items: T[],
  { page, pageSize }: { page: number; pageSize: number },
): PaginatedItems<T> => {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
};

export const countExercisesByTrack = (
  exercises: TrackExerciseSummary[],
): Record<ExerciseTrackId, number> =>
  EXERCISE_TRACKS.reduce(
    (counts, track) => ({
      ...counts,
      [track.id]: filterExercisesByTrack(exercises, track.id).length,
    }),
    { javascript: 0, react: 0, "html-css": 0 } as Record<ExerciseTrackId, number>,
  );
