import { validateStudentFiles } from "../validate-student-files.js";
import { runBrowserExerciseCheck } from "./browser-exercise-check.js";

export type { ExerciseCheckOutcome } from "./js-variables.js";
export type { ExerciseManifest } from "../exercise-manifest-types.js";
export { runBrowserExerciseCheck };

// Re-export for callers that imported validateStudentFiles from this module before.
export { validateStudentFiles };
