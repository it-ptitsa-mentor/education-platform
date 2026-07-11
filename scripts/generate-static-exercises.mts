import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toCategorizedExerciseSummary } from "../packages/shared/src/exercise-categories.ts";
import { classifyExerciseTest } from "../packages/shared/src/exercise-test-classify.ts";
import { loadExerciseManifest } from "../packages/shared/src/exercise-manifest.ts";
import { resolveExerciseTestKind } from "../packages/shared/src/exercise-test-generator.ts";

/**
 * Extract all CSS property names (including custom properties) from a CSS string.
 * Scans declarations inside { } blocks, e.g. "font-size: 16px" → "font-size",
 * "--primary-color: #333" → "--primary-color".
 */
const extractCssPropertyNames = (css: string): string[] => {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const names = new Set<string>();
  // Match declarations like: "property-name: value" or "--custom-prop: value"
  // Look for transitions between ; or { and a property name
  const declRe = /(?:^|[{;])\s*(--[\w-]+|[a-zA-Z][\w-]*)\s*:/gm;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(noComments)) !== null) {
    names.add(m[1]);
  }
  return [...names];
};

/** Extract all top-level CSS selectors from a CSS string. */
const extractCssSelectors = (css: string): string[] => {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors: string[] = [];
  const blockRe = /([^{}]+)\{[^{}]*\}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(noComments)) !== null) {
    const selectorPart = m[1].trim();
    if (!selectorPart || selectorPart.startsWith("@")) continue;
    for (const sel of selectorPart.split(",")) {
      const trimmed = sel.trim().replace(/\s+/g, " ");
      if (trimmed) selectors.push(trimmed);
    }
  }
  return [...new Set(selectors)];
};

/** Extract all class names from HTML class="..." attributes. */
const extractHtmlClasses = (html: string): string[] => {
  const classes = new Set<string>();
  const classRe = /class="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(html)) !== null) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls) classes.add(cls);
    }
  }
  return [...classes];
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exercisesRoot = path.join(repoRoot, "exercises");
const outputDir = path.join(repoRoot, "packages/web/src/generated");
const outputFile = path.join(outputDir, "exercises-data.ts");

const readStarterFiles = async (slug: string, filesToOpen: string[]) => {
  const exerciseDir = path.join(exercisesRoot, slug);
  const entries = await Promise.all(
    filesToOpen.map(async (filePath) => [
      filePath,
      await readFile(path.join(exerciseDir, filePath), "utf8"),
    ]),
  );

  return Object.fromEntries(entries);
};

/** Read test files from __tests__/ directory (for classification). */
const readTestFiles = async (slug: string): Promise<Record<string, string>> => {
  const testsDir = path.join(exercisesRoot, slug, "__tests__");
  try {
    const entries = await readdir(testsDir);
    const pairs = await Promise.all(
      entries
        .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
        .map(async (f) => [f, await readFile(path.join(testsDir, f), "utf8")] as const),
    );
    return Object.fromEntries(pairs);
  } catch {
    return {};
  }
};

/** Read solution files from __solution__/ directory if it exists. */
const readSolutionFiles = async (
  slug: string,
  studentFiles: string[],
): Promise<Record<string, string> | null> => {
  const solutionDir = path.join(exercisesRoot, slug, "__solution__");
  try {
    await stat(solutionDir);
  } catch {
    return null; // no __solution__/ directory
  }

  try {
    const pairs = await Promise.all(
      studentFiles.map(async (filePath) => {
        const full = path.join(solutionDir, filePath);
        try {
          return [filePath, await readFile(full, "utf8")] as const;
        } catch {
          return null;
        }
      }),
    );
    const entries = pairs.filter((p): p is [string, string] => p !== null);
    return entries.length > 0 ? Object.fromEntries(entries) : null;
  } catch {
    return null;
  }
};

/**
 * Фаза 2 (полная раскатка): для всех html/css-content заданий с __solution__/
 * вычисляем expectedClasses (delta HTML-классов), expectedSelectors (delta CSS-селекторов)
 * и expectedDeclarations (delta CSS-свойств).
 * Если solution не найден или delta пуста — возвращаем {}.
 */
const computeStructuralHints = async (
  manifest: Awaited<ReturnType<typeof loadExerciseManifest>>,
  starterFiles: Record<string, string>,
): Promise<{
  expectedClasses?: string[];
  expectedSelectors?: string[];
  expectedDeclarations?: string[];
}> => {
  const kind = resolveExerciseTestKind(manifest);
  if (kind !== "html-content" && kind !== "css-content") return {};

  const solutionFiles = await readSolutionFiles(manifest.slug, manifest.studentFiles);
  if (!solutionFiles) return {};

  let expectedClasses: string[] | undefined;
  let expectedSelectors: string[] | undefined;
  let expectedDeclarations: string[] | undefined;

  // Extract class names from solution HTML (present in HTML but not necessarily in starter)
  const htmlFiles = manifest.studentFiles.filter((f) => f.endsWith(".html"));
  if (htmlFiles.length > 0) {
    const solutionHtml = solutionFiles[htmlFiles[0]];
    const starterHtml = starterFiles[htmlFiles[0]] ?? "";
    if (solutionHtml) {
      const solutionClasses = extractHtmlClasses(solutionHtml);
      const starterClasses = new Set(extractHtmlClasses(starterHtml));
      // Only require classes that are added in the solution (not present in the starter)
      const delta = solutionClasses.filter((cls) => !starterClasses.has(cls));
      if (delta.length > 0) expectedClasses = delta;
    }
  }

  // Extract CSS selectors and property names from solution CSS, compute delta vs starter
  const cssFiles = manifest.studentFiles.filter((f) => f.endsWith(".css"));
  if (cssFiles.length > 0) {
    const allSolutionSelectors: string[] = [];
    const allStarterSelectors = new Set<string>();
    const allSolutionProperties: string[] = [];
    const allStarterProperties = new Set<string>();

    for (const cssFile of cssFiles) {
      const solutionCss = solutionFiles[cssFile];
      const starterCss = starterFiles[cssFile] ?? "";
      if (solutionCss) {
        allSolutionSelectors.push(...extractCssSelectors(solutionCss));
        allSolutionProperties.push(...extractCssPropertyNames(solutionCss));
      }
      for (const sel of extractCssSelectors(starterCss)) {
        allStarterSelectors.add(sel);
      }
      for (const prop of extractCssPropertyNames(starterCss)) {
        allStarterProperties.add(prop);
      }
    }

    const selectorDelta = [...new Set(allSolutionSelectors)].filter(
      (sel) => !allStarterSelectors.has(sel),
    );
    if (selectorDelta.length > 0) expectedSelectors = selectorDelta;

    const propDelta = [...new Set(allSolutionProperties)].filter(
      (prop) => !allStarterProperties.has(prop),
    );
    if (propDelta.length > 0) expectedDeclarations = propDelta;
  }

  return { expectedClasses, expectedSelectors, expectedDeclarations };
};

const entries = await readdir(exercisesRoot, { withFileTypes: true });
const loaded = await Promise.all(
  entries
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const manifest = await loadExerciseManifest(
        path.join(exercisesRoot, entry.name, "exercise.json"),
      );
      const files = await readStarterFiles(manifest.slug, manifest.filesToOpen);
      const testFiles = await readTestFiles(manifest.slug);
      const testClass = classifyExerciseTest(manifest, testFiles);
      const solutionFiles =
        testClass === "stub"
          ? await readSolutionFiles(manifest.slug, manifest.studentFiles)
          : null;

      const structuralHints = await computeStructuralHints(manifest, files);

      return {
        manifest,
        testClass,
        exercise: {
          slug: manifest.slug,
          title: manifest.title,
          language: manifest.language,
          filesToOpen: manifest.filesToOpen,
          studentFiles: manifest.studentFiles,
          readme: manifest.readme,
          testClass,
          solutionFiles: solutionFiles,
          ...(structuralHints.expectedClasses !== undefined && {
            expectedClasses: structuralHints.expectedClasses,
          }),
          ...(structuralHints.expectedSelectors !== undefined && {
            expectedSelectors: structuralHints.expectedSelectors,
          }),
          ...(structuralHints.expectedDeclarations !== undefined && {
            expectedDeclarations: structuralHints.expectedDeclarations,
          }),
          files,
        },
      };
    }),
);

const exercises = loaded.map(({ exercise }) => exercise);
const summaries = loaded.map(({ manifest, testClass }) =>
  toCategorizedExerciseSummary(manifest, testClass),
);

await mkdir(outputDir, { recursive: true });
await writeFile(
  outputFile,
  `// Generated by scripts/generate-static-exercises.mts — do not edit.\nexport const staticExerciseSummaries = ${JSON.stringify(summaries, null, 2)} as const;\n\nexport const staticExercises = ${JSON.stringify(exercises, null, 2)} as const;\n`,
  "utf8",
);

console.log(`Wrote ${exercises.length} exercise(s) to ${outputFile}`);
