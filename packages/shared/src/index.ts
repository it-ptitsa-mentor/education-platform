export type { ExerciseLanguage, ExerciseManifest } from "./exercise-manifest-types.js";
export {
  loadExerciseManifest,
  validateStudentFiles,
} from "./exercise-manifest.js";
export {
  runBrowserExerciseCheck,
  type ExerciseCheckOutcome,
} from "./exercise-checks/index.js";
export {
  groupExercisesByCategory,
  resolveExerciseCategory,
  toCategorizedExerciseSummary,
  type CategorizedExerciseSummary,
  type ExerciseCategoryGroup,
  type ExerciseCategoryMeta,
} from "./exercise-categories.js";
