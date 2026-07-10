import {
  extractPrimaryCodeBlock,
  inferConsoleLogExpectations,
  isTypedExercise,
  pickJsImportEntry,
  resolveExerciseTestKind,
} from "../exercise-test-generator.js";
import { validateStudentFiles } from "../validate-student-files.js";
import type { ExerciseManifest } from "../exercise-manifest-types.js";
import {
  assertCssRules,
  assertHtmlMarkup,
  assertJsxComponent,
  assertNonEmpty,
  assertRequiredClasses,
  assertRequiredSelectors,
  collectAssertionErrors,
} from "./file-assertions.js";
import { checkImportedPlaceholder } from "./imported-placeholder.js";
import { checkJsConsoleOutput, checkJsModuleLoad } from "./js-runtime-check.js";
import { checkJsVariables, type ExerciseCheckOutcome } from "./js-variables.js";

const CUSTOM_BROWSER_CHECKS: Record<
  string,
  (files: Record<string, string>) => Promise<ExerciseCheckOutcome>
> = {
  "js-variables": async (files) => checkJsVariables(files["solution.js"] ?? ""),
  "js-basics-variables": async (files) =>
    checkJsConsoleOutput(files["solution.js"] ?? "", ["Dragon", "Dragon"]),
};

const outcomeFromAssertionErrors = (checks: Array<string | null>): ExerciseCheckOutcome => {
  const errors = collectAssertionErrors(checks);
  if (errors.length === 0) {
    return {
      passed: true,
      exitCode: 0,
      stdout: "All browser checks passed",
      stderr: "",
    };
  }

  return {
    passed: false,
    exitCode: 1,
    stdout: "",
    stderr: errors.join("\n"),
  };
};

const checkTypeScriptFiles = (
  manifest: ExerciseManifest,
  studentFiles: Record<string, string>,
): ExerciseCheckOutcome => {
  const errors = collectAssertionErrors(
    manifest.studentFiles
      .filter((filePath) => filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
      .map((filePath) => assertNonEmpty(studentFiles[filePath] ?? "", filePath)),
  );

  if (errors.length > 0) {
    return outcomeFromAssertionErrors(errors);
  }

  return {
    passed: true,
    exitCode: 0,
    stdout:
      "TypeScript files present. Full type checks run locally via API/Vitest.",
    stderr: "",
  };
};

export const runBrowserExerciseCheck = async (
  manifest: ExerciseManifest,
  studentFiles: Record<string, string>,
): Promise<ExerciseCheckOutcome> => {
  validateStudentFiles(manifest, studentFiles);

  const customCheck = CUSTOM_BROWSER_CHECKS[manifest.slug];
  if (customCheck) {
    return customCheck(studentFiles);
  }

  const kind = resolveExerciseTestKind(manifest);

  if (kind === "skip") {
    return checkImportedPlaceholder();
  }

  if (kind === "js-solution-console") {
    const block = extractPrimaryCodeBlock(manifest.readme);
    const expectations =
      block && isTypedExercise(manifest.readme)
        ? inferConsoleLogExpectations(block)
        : [];

    return checkJsConsoleOutput(studentFiles["solution.js"] ?? "", expectations);
  }

  if (kind === "js-solution-smoke") {
    return checkJsModuleLoad(studentFiles["solution.js"] ?? "");
  }

  if (kind === "ts-solution-console" || kind === "ts-solution-smoke") {
    return checkTypeScriptFiles(manifest, studentFiles);
  }

  if (kind === "shell-solution") {
    return outcomeFromAssertionErrors([
      assertNonEmpty(studentFiles.solution ?? "", "solution"),
    ]);
  }

  if (kind === "css-content") {
    return outcomeFromAssertionErrors(
      manifest.studentFiles.flatMap((filePath) => {
        const content = studentFiles[filePath] ?? "";
        const baseCheck = assertCssRules(content, filePath);
        if (baseCheck !== null) return [baseCheck];
        // Structural check: verify required selectors when manifest provides them.
        if (manifest.expectedSelectors && manifest.expectedSelectors.length > 0) {
          return assertRequiredSelectors(content, manifest.expectedSelectors);
        }
        return [null];
      }),
    );
  }

  if (kind === "html-content") {
    return outcomeFromAssertionErrors(
      manifest.studentFiles.flatMap((filePath) => {
        const content = studentFiles[filePath] ?? "";
        if (filePath.endsWith(".html")) {
          const baseCheck = assertHtmlMarkup(content, filePath);
          if (baseCheck !== null) return [baseCheck];
          // Structural check: verify required class names when manifest provides them.
          if (manifest.expectedClasses && manifest.expectedClasses.length > 0) {
            return assertRequiredClasses(content, manifest.expectedClasses);
          }
          return [null];
        }
        if (filePath.endsWith(".css")) {
          const baseCheck = assertNonEmpty(content, filePath);
          if (baseCheck !== null) return [baseCheck];
          // Structural check: verify required selectors when manifest provides them.
          if (manifest.expectedSelectors && manifest.expectedSelectors.length > 0) {
            return assertRequiredSelectors(content, manifest.expectedSelectors);
          }
          return [null];
        }
        return null;
      }),
    );
  }

  if (kind === "jsx-static") {
    const jsxErrors = collectAssertionErrors(
      manifest.studentFiles
        .filter((filePath) => filePath.endsWith(".jsx"))
        .map((filePath) =>
          assertJsxComponent(studentFiles[filePath] ?? "", filePath),
        ),
    );

    if (jsxErrors.length > 0) {
      return outcomeFromAssertionErrors(jsxErrors);
    }

    const jsEntry = pickJsImportEntry(
      manifest.studentFiles.filter((filePath) => filePath.endsWith(".js")),
    );

    if (jsEntry) {
      return checkJsModuleLoad(studentFiles[jsEntry] ?? "");
    }

    return outcomeFromAssertionErrors([]);
  }

  if (kind === "js-module-smoke") {
    return outcomeFromAssertionErrors(
      collectAssertionErrors(
        manifest.studentFiles.map((filePath) =>
          assertNonEmpty(studentFiles[filePath] ?? "", filePath),
        ),
      ),
    );
  }

  return outcomeFromAssertionErrors(
    collectAssertionErrors(
      manifest.studentFiles.map((filePath) =>
        assertNonEmpty(studentFiles[filePath] ?? "", filePath),
      ),
    ),
  );
};
