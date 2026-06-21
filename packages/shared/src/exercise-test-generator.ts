import type { ExerciseManifest } from "./exercise-manifest-types.js";

const JS_FENCE = /```(?:javascript|js|typescript|ts)\n([\s\S]*?)```/i;

export const CUSTOM_EXERCISE_TESTS = new Set(["js-variables", "js-basics-variables"]);

const MODULE_ENTRY_PRIORITY = [
  "index.js",
  "application.js",
  "src/index.js",
  "src/application.js",
  "src/index.jsx",
  "src/App.jsx",
];

export const extractPrimaryCodeBlock = (readme: string): string | null => {
  const match = readme.match(JS_FENCE);
  return match?.[1]?.trim() ?? null;
};

export const inferConsoleLogExpectations = (code: string): string[] => {
  const expectations: string[] = [];
  const pattern = /console\.log\(\s*(['"`])((?:\\.|(?!\1).)*)\1\s*\)/g;

  for (const match of code.matchAll(pattern)) {
    const quote = match[1];
    const raw = match[2];
    expectations.push(
      raw
        .replace(/\\n/g, "\n")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .replace(new RegExp(`\\\\${quote}`, "g"), quote),
    );
  }

  return expectations;
};

export const isTypedExercise = (readme: string) =>
  /наберите|символ в символ|type the following|copy the code/i.test(readme);

export const usesStudentAuthoredTests = (
  manifest: Pick<ExerciseManifest, "studentFiles">,
) => manifest.studentFiles.some((filePath) => filePath.startsWith("__tests__/"));

export const shouldSkipGeneratedTest = (
  manifest: Pick<ExerciseManifest, "slug" | "studentFiles">,
) =>
  CUSTOM_EXERCISE_TESTS.has(manifest.slug) || usesStudentAuthoredTests(manifest);

export type ExerciseTestKind =
  | "skip"
  | "js-solution-console"
  | "js-solution-smoke"
  | "ts-solution-console"
  | "ts-solution-smoke"
  | "js-module-smoke"
  | "jsx-static"
  | "css-content"
  | "html-content"
  | "shell-solution"
  | "file-content";

export const pickJsImportEntry = (studentFiles: string[]) => {
  const prioritized = MODULE_ENTRY_PRIORITY.find((filePath) =>
    studentFiles.includes(filePath),
  );
  if (prioritized) {
    return prioritized;
  }

  return studentFiles.find((filePath) => filePath.endsWith(".js")) ?? null;
};

export const resolveExerciseTestKind = (
  manifest: Pick<ExerciseManifest, "slug" | "studentFiles" | "readme">,
): ExerciseTestKind => {
  if (shouldSkipGeneratedTest(manifest)) {
    return "skip";
  }

  const { studentFiles, readme } = manifest;

  if (studentFiles.includes("solution.js")) {
    const block = extractPrimaryCodeBlock(readme);
    const expectations =
      block && isTypedExercise(readme) ? inferConsoleLogExpectations(block) : [];
    return expectations.length > 0 ? "js-solution-console" : "js-solution-smoke";
  }

  if (studentFiles.includes("solution.ts")) {
    const block = extractPrimaryCodeBlock(readme);
    const expectations =
      block && isTypedExercise(readme) ? inferConsoleLogExpectations(block) : [];
    return expectations.length > 0 ? "ts-solution-console" : "ts-solution-smoke";
  }

  if (studentFiles.length === 1 && studentFiles[0] === "solution") {
    return "shell-solution";
  }

  if (studentFiles.length > 0 && studentFiles.every((filePath) => filePath.endsWith(".css"))) {
    return "css-content";
  }

  if (studentFiles.some((filePath) => filePath.endsWith(".html"))) {
    return "html-content";
  }

  if (studentFiles.some((filePath) => filePath.endsWith(".jsx"))) {
    return "jsx-static";
  }

  if (studentFiles.every((filePath) => filePath.endsWith(".js"))) {
    return "js-module-smoke";
  }

  return "file-content";
};

export const resolveGeneratedTestFilename = (kind: ExerciseTestKind) => {
  if (kind === "ts-solution-console" || kind === "ts-solution-smoke") {
    return "solution.test.ts";
  }

  if (kind === "js-solution-console" || kind === "js-solution-smoke") {
    return "solution.test.js";
  }

  return "exercise.test.js";
};

const relativeImportPath = (filePath: string) => {
  const normalized = filePath.startsWith("./") ? filePath.slice(2) : filePath;
  return `../${normalized}`;
};

type FileAssertion = "non-empty" | "css-rules" | "html-markup" | "jsx-component";

const fileAssertionBody = (filePath: string, assertion: FileAssertion) => {
  if (assertion === "non-empty") {
    return `    const content = readFileSync(path.join(exerciseDir, ${JSON.stringify(filePath)}), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);`;
  }

  if (assertion === "css-rules") {
    return `    const css = readFileSync(path.join(exerciseDir, ${JSON.stringify(filePath)}), "utf8");
    expect(css.trim().length).toBeGreaterThan(0);
    expect(css).toMatch(/\\{[\\s\\S]*\\}/);`;
  }

  if (assertion === "html-markup") {
    return `    const html = readFileSync(path.join(exerciseDir, ${JSON.stringify(filePath)}), "utf8").toLowerCase();
    expect(html).toMatch(/<html|<!doctype|<body|<div|<main|<section/);`;
  }

  return `    const source = readFileSync(path.join(exerciseDir, ${JSON.stringify(filePath)}), "utf8");
    expect(source).toMatch(/export\\s+(default\\s+)?(?:function|class|const)/);`;
};

const renderReadFileSuite = (
  slug: string,
  checks: Array<{ filePath: string; assertion: FileAssertion; title?: string }>,
) => {
  const cases = checks
    .map(({ filePath, assertion, title }) => {
      const label = title ?? filePath;
      return `  it(${JSON.stringify(label)}, () => {
${fileAssertionBody(filePath, assertion)}
  });`;
    })
    .join("\n\n");

  return `import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe(${JSON.stringify(slug)}, () => {
${cases}
});
`;
};

const renderConsoleOutputTest = (
  slug: string,
  modulePath: string,
  expectations: string[],
) => {
  const expectedJson = JSON.stringify(expectations);
  return `import { afterEach, describe, expect, it, vi } from "vitest";

describe(${JSON.stringify(slug)}, () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("prints expected console output from readme", async () => {
    const lines = [];
    vi.spyOn(console, "log").mockImplementation((value) => {
      lines.push(String(value));
    });

    await import(${JSON.stringify(modulePath)});

    expect(lines).toEqual(${expectedJson});
  });
});
`;
};

const renderImportSmokeTest = (slug: string, modulePath: string) => `import { describe, expect, it } from "vitest";

describe(${JSON.stringify(slug)}, () => {
  it("loads without syntax errors", async () => {
    await expect(import(${JSON.stringify(modulePath)})).resolves.toBeDefined();
  });
});
`;

export const generateExerciseTest = (
  manifest: Pick<ExerciseManifest, "slug" | "studentFiles" | "readme">,
): string | null => {
  const kind = resolveExerciseTestKind(manifest);

  if (kind === "skip") {
    return null;
  }

  if (kind === "js-solution-console" || kind === "ts-solution-console") {
    const block = extractPrimaryCodeBlock(manifest.readme);
    const expectations = block ? inferConsoleLogExpectations(block) : [];
    const modulePath = relativeImportPath(
      kind === "ts-solution-console" ? "solution.ts" : "solution.js",
    );
    return renderConsoleOutputTest(manifest.slug, modulePath, expectations);
  }

  if (kind === "js-solution-smoke") {
    return renderImportSmokeTest(manifest.slug, relativeImportPath("solution.js"));
  }

  if (kind === "ts-solution-smoke") {
    return renderImportSmokeTest(manifest.slug, relativeImportPath("solution.ts"));
  }

  if (kind === "js-module-smoke") {
    return renderReadFileSuite(
      manifest.slug,
      manifest.studentFiles.map((filePath) => ({ filePath, assertion: "non-empty" })),
    );
  }

  if (kind === "shell-solution") {
    return renderReadFileSuite(manifest.slug, [
      { filePath: "solution", assertion: "non-empty" },
    ]);
  }

  if (kind === "css-content") {
    return renderReadFileSuite(
      manifest.slug,
      manifest.studentFiles.map((filePath) => ({
        filePath,
        assertion: "non-empty",
        title: `${filePath} is present`,
      })),
    );
  }

  if (kind === "html-content") {
    return renderReadFileSuite(manifest.slug, [
      ...manifest.studentFiles
        .filter((filePath) => filePath.endsWith(".html"))
        .map((filePath) => ({
          filePath,
          assertion: "html-markup" as const,
          title: `${filePath} contains html markup`,
        })),
      ...manifest.studentFiles
        .filter((filePath) => filePath.endsWith(".css"))
        .map((filePath) => ({
          filePath,
          assertion: "non-empty" as const,
          title: `${filePath} is present`,
        })),
    ]);
  }

  if (kind === "jsx-static") {
    const checks = [
      ...manifest.studentFiles
        .filter((filePath) => filePath.endsWith(".jsx"))
        .map((filePath) => ({
          filePath,
          assertion: "jsx-component" as const,
          title: `${filePath} defines a component`,
        })),
    ];

    const jsEntry = pickJsImportEntry(
      manifest.studentFiles.filter((filePath) => filePath.endsWith(".js")),
    );

    if (jsEntry) {
      return `${renderImportSmokeTest(manifest.slug, relativeImportPath(jsEntry))}\n\n${renderReadFileSuite(`${manifest.slug} components`, checks)}`;
    }

    return renderReadFileSuite(manifest.slug, checks);
  }

  return renderReadFileSuite(
    manifest.slug,
    manifest.studentFiles.map((filePath) => ({ filePath, assertion: "non-empty" })),
  );
};

/** @deprecated Use generateExerciseTest */
export const generateSolutionJsTest = (slug: string, readme: string): string => {
  const generated = generateExerciseTest({
    slug,
    readme,
    studentFiles: ["solution.js"],
  });
  return generated ?? "";
};
