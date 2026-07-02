import type { ExerciseManifest } from "./exercise-manifest-types.js";
import {
  generateExerciseTest,
  resolveExerciseTestKind,
  shouldSkipGeneratedTest,
} from "./exercise-test-generator.js";

/**
 * Класс теста задания:
 * - custom — рукописные ассерты (или тест пишет сам ученик);
 * - generated-console — сгенерирован из readme, проверяет console-вывод;
 * - stub — заглушка «файл не пустой / модуль импортируется»;
 * - missing — тестов нет вообще.
 */
export type ExerciseTestClass =
  | "custom"
  | "generated-console"
  | "stub"
  | "missing";

const CONSOLE_KINDS = new Set(["js-solution-console", "ts-solution-console"]);

// Ассерты, которые дают сгенерированные заглушки. Если после их удаления
// в файле не остаётся expect(...) — реальных проверок в тесте нет.
const STUB_ASSERT_PATTERNS = [
  /await expect\(import\([^)]*\)\)\.resolves\.toBeDefined\(\)/g,
  /expect\((?:content|css)\.trim\(\)\.length\)\.toBeGreaterThan\(0\)/g,
  /expect\(css\)\.toMatch\([^\n]*\)/g,
  /expect\(html\)\.toMatch\([^\n]*\)/g,
  /expect\(source\)\.toMatch\([^\n]*\)/g,
];

const hasOnlyStubAsserts = (source: string) => {
  let stripped = source;
  for (const pattern of STUB_ASSERT_PATTERNS) {
    stripped = stripped.replace(pattern, "");
  }
  return !/expect\s*\(/.test(stripped);
};

export const classifyExerciseTest = (
  manifest: Pick<ExerciseManifest, "slug" | "studentFiles" | "readme">,
  testFiles: Record<string, string>,
): ExerciseTestClass => {
  if (shouldSkipGeneratedTest(manifest)) {
    return "custom";
  }

  const sources = Object.values(testFiles);
  if (sources.length === 0) {
    return "missing";
  }

  const generated = generateExerciseTest(manifest);
  const kind = resolveExerciseTestKind(manifest);
  const matchesGenerated =
    generated !== null && sources.some((source) => source === generated);

  if (matchesGenerated && CONSOLE_KINDS.has(kind)) {
    return "generated-console";
  }

  if (sources.every(hasOnlyStubAsserts)) {
    return "stub";
  }

  return matchesGenerated ? "stub" : "custom";
};
