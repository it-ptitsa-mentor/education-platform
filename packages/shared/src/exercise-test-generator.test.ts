import { describe, expect, it } from "vitest";
import {
  generateExerciseTest,
  generateSolutionJsTest,
  inferConsoleLogExpectations,
  pickJsImportEntry,
  resolveExerciseTestKind,
  resolveGeneratedTestFilename,
  shouldSkipGeneratedTest,
} from "./exercise-test-generator.js";

describe("resolveExerciseTestKind", () => {
  it("skips custom and student-authored test exercises", () => {
    expect(
      resolveExerciseTestKind({
        slug: "js-variables",
        studentFiles: ["solution.js"],
        readme: "",
      }),
    ).toBe("skip");
    expect(
      resolveExerciseTestKind({
        slug: "js-testing-tdd",
        studentFiles: ["__tests__/fill.test.js", "fill.js"],
        readme: "",
      }),
    ).toBe("skip");
  });

  it("detects typed js and ts console exercises", () => {
    const readme = `Наберите код:

\`\`\`javascript
console.log('Hello, World!')
\`\`\`
`;
    expect(
      resolveExerciseTestKind({
        slug: "js-basics-hello-world",
        studentFiles: ["solution.js"],
        readme,
      }),
    ).toBe("js-solution-console");
    expect(
      resolveExerciseTestKind({
        slug: "typescript-basics-hello-world",
        studentFiles: ["solution.ts"],
        readme,
      }),
    ).toBe("ts-solution-console");
  });

  it("detects shell, css, html, jsx and module exercises", () => {
    expect(
      resolveExerciseTestKind({
        slug: "cli-basics-navigation",
        studentFiles: ["solution"],
        readme: "",
      }),
    ).toBe("shell-solution");
    expect(
      resolveExerciseTestKind({
        slug: "css-flex-container",
        studentFiles: ["styles/app.css"],
        readme: "",
      }),
    ).toBe("css-content");
    expect(
      resolveExerciseTestKind({
        slug: "layout-designer-basics-page-structure",
        studentFiles: ["index.html", "styles/app.css"],
        readme: "",
      }),
    ).toBe("html-content");
    expect(
      resolveExerciseTestKind({
        slug: "js-react-component",
        studentFiles: ["src/Card.jsx", "src/index.jsx"],
        readme: "",
      }),
    ).toBe("jsx-static");
    expect(
      resolveExerciseTestKind({
        slug: "js-arrays-syntax",
        studentFiles: ["arrays.js"],
        readme: "",
      }),
    ).toBe("js-module-smoke");
  });
});

describe("pickJsImportEntry", () => {
  it("prefers known entry files", () => {
    expect(pickJsImportEntry(["arrays.js", "src/application.js"])).toBe(
      "src/application.js",
    );
  });
});

describe("generateExerciseTest", () => {
  it("generates console output test for typed hello-world exercise", () => {
    const readme = `Наберите код:

\`\`\`javascript
console.log('Hello, World!')
\`\`\`
`;
    const test = generateExerciseTest({
      slug: "js-basics-hello-world",
      studentFiles: ["solution.js"],
      readme,
    });
    expect(test).toContain("Hello, World!");
    expect(test).toContain("../solution.js");
  });

  it("generates css presence test", () => {
    const test = generateExerciseTest({
      slug: "css-flex-container",
      studentFiles: ["styles/app.css"],
      readme: "css task",
    });
    expect(test).toContain("styles/app.css");
    expect(test).toContain("is present");
  });

  it("returns null for skipped exercises", () => {
    expect(
      generateExerciseTest({
        slug: "js-variables",
        studentFiles: ["solution.js"],
        readme: "",
      }),
    ).toBeNull();
  });
});

describe("resolveGeneratedTestFilename", () => {
  it("uses ts filename for typescript solution tests", () => {
    expect(resolveGeneratedTestFilename("ts-solution-smoke")).toBe("solution.test.ts");
    expect(resolveGeneratedTestFilename("js-module-smoke")).toBe("exercise.test.js");
  });
});

describe("shouldSkipGeneratedTest", () => {
  it("is true for custom slugs", () => {
    expect(
      shouldSkipGeneratedTest({
        slug: "js-basics-variables",
        studentFiles: ["solution.js"],
      }),
    ).toBe(true);
  });
});

describe("inferConsoleLogExpectations", () => {
  it("collects string literal arguments from console.log", () => {
    expect(inferConsoleLogExpectations("console.log('Hello, World!')")).toEqual([
      "Hello, World!",
    ]);
  });
});

describe("generateSolutionJsTest", () => {
  it("falls back to load smoke test when expectations unknown", () => {
    const test = generateSolutionJsTest(
      "js-basics-arithmetics",
      "## solution.js\n\nПосчитайте выражения\n",
    );
    expect(test).toContain("loads without syntax errors");
  });
});
