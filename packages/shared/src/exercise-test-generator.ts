const JS_FENCE = /```(?:javascript|js)\n([\s\S]*?)```/i;

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

const isTypedExercise = (readme: string) =>
  /наберите|символ в символ|type the following|copy the code/i.test(readme);

export const generateSolutionJsTest = (slug: string, readme: string): string => {
  const block = extractPrimaryCodeBlock(readme);
  const expectations =
    block && isTypedExercise(readme) ? inferConsoleLogExpectations(block) : [];

  if (expectations.length > 0) {
    const expectedJson = JSON.stringify(expectations);
    return `import { afterEach, describe, expect, it, vi } from "vitest";

describe("${slug}", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("prints expected console output from readme", async () => {
    const lines: string[] = [];
    vi.spyOn(console, "log").mockImplementation((value) => {
      lines.push(String(value));
    });

    await import("../solution.js");

    expect(lines).toEqual(${expectedJson});
  });
});
`;
  }

  return `import { describe, expect, it } from "vitest";

describe("${slug}", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../solution.js")).resolves.toBeDefined();
  });
});
`;
};
