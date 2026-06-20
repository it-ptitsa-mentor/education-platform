import { describe, expect, it } from "vitest";
import {
  extractPrimaryCodeBlock,
  generateSolutionJsTest,
  inferConsoleLogExpectations,
} from "./exercise-test-generator.js";

describe("extractPrimaryCodeBlock", () => {
  it("returns first javascript fenced block", () => {
    const readme = `## solution.js

\`\`\`javascript
console.log('Hello, World!')
\`\`\`
`;
    expect(extractPrimaryCodeBlock(readme)).toBe("console.log('Hello, World!')");
  });

  it("returns null when no code block", () => {
    expect(extractPrimaryCodeBlock("just text")).toBeNull();
  });
});

describe("inferConsoleLogExpectations", () => {
  it("collects string literal arguments from console.log", () => {
    expect(inferConsoleLogExpectations("console.log('Hello, World!')")).toEqual([
      "Hello, World!",
    ]);
  });

  it("returns empty for non-literal logs", () => {
    expect(inferConsoleLogExpectations("console.log(x)")).toEqual([]);
  });
});

describe("generateSolutionJsTest", () => {
  it("generates console output test for typed hello-world exercise", () => {
    const readme = `Наберите код:

\`\`\`javascript
console.log('Hello, World!')
\`\`\`
`;
    const test = generateSolutionJsTest("js-basics-hello-world", readme);
    expect(test).toContain("Hello, World!");
    expect(test).toContain("solution.js");
  });

  it("falls back to load smoke test when expectations unknown", () => {
    const test = generateSolutionJsTest(
      "js-basics-arithmetics",
      "## solution.js\n\nПосчитайте выражения\n",
    );
    expect(test).toContain("loads without syntax errors");
  });
});
