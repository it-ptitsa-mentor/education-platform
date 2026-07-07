/**
 * Валидация тестов заданий + генерация exercises/TESTS_STATUS.md.
 *
 * Для каждого задания:
 * 1. Классифицирует тест: custom / generated-console / stub / missing.
 * 2. Если есть эталон `__solution__/` — гоняет Vitest дважды:
 *    тест должен ПРОЙТИ на эталоне и УПАСТЬ на стартере (status=validated).
 *
 * Запуск:
 *   pnpm validate:exercise-tests                # всё: классификация + валидация + отчёт
 *   pnpm validate:exercise-tests --slug <slug>  # одно задание (можно повторять флаг)
 *   pnpm validate:exercise-tests --report-only  # без прогона Vitest (быстро)
 *
 * Выход 1 — если у какого-то эталона тест падает (solution-fails):
 * это сломанный тест или сломанный эталон, чинить обязательно.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadExerciseManifest } from "../packages/shared/src/exercise-manifest.ts";
import { classifyExerciseTest } from "../packages/shared/src/exercise-test-classify.ts";
import type { ExerciseTestClass } from "../packages/shared/src/exercise-test-classify.ts";
import {
  readSolutionFiles,
  validateExerciseTest,
} from "../packages/runner/src/validate-exercise-test.ts";
import type { ExerciseValidationStatus } from "../packages/runner/src/validate-exercise-test.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exercisesRoot = path.join(repoRoot, "exercises");
const statusFile = path.join(exercisesRoot, "TESTS_STATUS.md");

type ExerciseRow = {
  slug: string;
  topic: string;
  testClass: ExerciseTestClass;
  hasSolution: boolean;
  validation: ExerciseValidationStatus | "skipped";
};

const parseArgs = (argv: string[]) => {
  const slugs: string[] = [];
  let reportOnly = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--slug" && argv[i + 1]) {
      slugs.push(argv[i + 1]);
      i += 1;
    } else if (argv[i] === "--report-only") {
      reportOnly = true;
    }
  }
  return { slugs, reportOnly };
};

const readTestFiles = async (slug: string): Promise<Record<string, string>> => {
  const testsDir = path.join(exercisesRoot, slug, "__tests__");
  try {
    const names = await readdir(testsDir);
    const entries = await Promise.all(
      names
        .filter((name) => /\.(js|jsx|ts|tsx)$/.test(name))
        .map(async (name) => [
          name,
          await readFile(path.join(testsDir, name), "utf8"),
        ]),
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
};

const renderStatusMarkdown = (rows: ExerciseRow[]) => {
  const byTopic = new Map<string, ExerciseRow[]>();
  for (const row of rows) {
    const list = byTopic.get(row.topic) ?? [];
    list.push(row);
    byTopic.set(row.topic, list);
  }

  const count = (list: ExerciseRow[], pred: (r: ExerciseRow) => boolean) =>
    list.filter(pred).length;

  const header = [
    "# Статус тестов заданий",
    "",
    "> Генерируется `pnpm validate:exercise-tests` — не редактировать руками.",
    "> Классы: **custom** — рукописные ассерты; **console** — сгенерирован из readme",
    "> (проверка вывода); **stub** — заглушка «файл не пустой».",
    "> **Эталон** — есть `__solution__/`; **validated** — тест прошёл на эталоне и упал на стартере.",
    "",
    `Всего заданий: **${rows.length}** · custom: **${count(rows, (r) => r.testClass === "custom")}** · console: **${count(rows, (r) => r.testClass === "generated-console")}** · stub: **${count(rows, (r) => r.testClass === "stub")}**`,
    "",
    `Эталонов: **${count(rows, (r) => r.hasSolution)}** · validated: **${count(rows, (r) => r.validation === "validated")}** · starter-passes: **${count(rows, (r) => r.validation === "starter-passes")}** · solution-fails: **${count(rows, (r) => r.validation === "solution-fails")}**`,
    "",
    "| Тема | Всего | Custom | Console | Stub | Эталоны | Validated |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  const topicRows = [...byTopic.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "ru"))
    .map(([topic, list]) => {
      const cells = [
        topic,
        String(list.length),
        String(count(list, (r) => r.testClass === "custom")),
        String(count(list, (r) => r.testClass === "generated-console")),
        String(count(list, (r) => r.testClass === "stub")),
        String(count(list, (r) => r.hasSolution)),
        String(count(list, (r) => r.validation === "validated")),
      ];
      return `| ${cells.join(" | ")} |`;
    });

  return [...header, ...topicRows, ""].join("\n");
};

const main = async () => {
  const { slugs, reportOnly } = parseArgs(process.argv.slice(2));

  const entries = await readdir(exercisesRoot, { withFileTypes: true });
  const allSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const targetSlugs = slugs.length > 0 ? slugs : allSlugs;

  const rows: ExerciseRow[] = [];
  const failures: string[] = [];

  for (const slug of targetSlugs) {
    const manifest = await loadExerciseManifest(
      path.join(exercisesRoot, slug, "exercise.json"),
    );
    const testFiles = await readTestFiles(slug);
    const testClass = classifyExerciseTest(manifest, testFiles);
    const hasSolution =
      (await readSolutionFiles(exercisesRoot, slug)) !== null;

    let validation: ExerciseRow["validation"] = "skipped";
    if (hasSolution && !reportOnly) {
      const result = await validateExerciseTest({ exercisesRoot, slug });
      validation = result.status;
      const mark =
        result.status === "validated"
          ? "✓"
          : result.status === "starter-passes"
            ? "~"
            : "✗";
      console.log(`${mark} ${slug}: ${result.status}`);
      if (result.status === "solution-fails") {
        failures.push(slug);
        console.error(result.solutionRun?.stderr ?? "");
      }
    }

    rows.push({
      slug,
      topic: manifest.hexlet?.courseName ?? "Без темы",
      testClass,
      hasSolution,
      validation,
    });
  }

  // Полный отчёт пишем только при прогоне по всем заданиям,
  // чтобы --slug не затирал общую статистику
  if (slugs.length === 0) {
    await writeFile(statusFile, renderStatusMarkdown(rows), "utf8");
    console.log(`\nОтчёт: ${path.relative(repoRoot, statusFile)}`);
  }

  const stubs = rows.filter((row) => row.testClass === "stub").length;
  console.log(
    `Итого: ${rows.length} заданий, stub: ${stubs}, эталонов: ${rows.filter((r) => r.hasSolution).length}, validated: ${rows.filter((r) => r.validation === "validated").length}`,
  );

  if (failures.length > 0) {
    console.error(`\nСломанные тесты/эталоны (${failures.length}): ${failures.join(", ")}`);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
