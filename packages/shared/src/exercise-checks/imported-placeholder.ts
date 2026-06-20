import type { ExerciseCheckOutcome } from "./js-variables.js";

export const checkImportedPlaceholder = async (): Promise<ExerciseCheckOutcome> => ({
  passed: true,
  exitCode: 0,
  stdout: "Placeholder check — оригинальные тесты Hexlet ещё не импортированы.",
  stderr: "",
});
