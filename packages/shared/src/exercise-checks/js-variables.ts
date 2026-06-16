export type ExerciseCheckOutcome = {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export const checkJsVariables = async (
  solutionCode: string,
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
    return {
      passed: false,
      exitCode: 1,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }

  const passed =
    lines.length === 2 && lines[0] === "Dragon" && lines[1] === "Dragon";

  return {
    passed,
    exitCode: passed ? 0 : 1,
    stdout: passed ? "OK" : "",
    stderr: passed
      ? ""
      : `Expected console output ["Dragon", "Dragon"], got ${JSON.stringify(lines)}`,
  };
};
