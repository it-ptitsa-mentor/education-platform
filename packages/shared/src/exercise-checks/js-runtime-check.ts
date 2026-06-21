import type { ExerciseCheckOutcome } from "./js-variables.js";

const pass = (stdout: string): ExerciseCheckOutcome => ({
  passed: true,
  exitCode: 0,
  stdout,
  stderr: "",
});

const fail = (stderr: string): ExerciseCheckOutcome => ({
  passed: false,
  exitCode: 1,
  stdout: "",
  stderr,
});

export const checkJsConsoleOutput = async (
  solutionCode: string,
  expectations: string[],
): Promise<ExerciseCheckOutcome> => {
  const lines: string[] = [];
  const consoleMock = {
    log: (value: unknown) => {
      lines.push(String(value));
    },
  };

  try {
    new Function("console", solutionCode)(consoleMock);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }

  const passed = JSON.stringify(lines) === JSON.stringify(expectations);

  if (!passed) {
    return fail(
      `Expected console output ${JSON.stringify(expectations)}, got ${JSON.stringify(lines)}`,
    );
  }

  return pass("OK");
};

const loadStrategies = [
  async (code: string) => {
    const dataUrl = `data:text/javascript,${encodeURIComponent(code)}`;
    await import(/* @vite-ignore */ dataUrl);
  },
  async (code: string) => {
    if (typeof Blob === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) {
      throw new Error("Blob URLs are unavailable");
    }

    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
  },
  async (code: string) => {
    new Function(code)();
  },
];

export const checkJsModuleLoad = async (code: string): Promise<ExerciseCheckOutcome> => {
  if (!code.trim()) {
    return fail("Module source is empty");
  }

  const errors: string[] = [];

  for (const load of loadStrategies) {
    try {
      await load(code);
      return pass("Module loaded without syntax errors");
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  return fail(errors.at(-1) ?? "Failed to load module");
};
