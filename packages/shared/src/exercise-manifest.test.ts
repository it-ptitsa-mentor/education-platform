import { describe, expect, it } from "vitest";
import {
  loadExerciseManifest,
  validateStudentFiles,
  type ExerciseManifest,
} from "./exercise-manifest.js";

describe("loadExerciseManifest", () => {
  it("reads slug title and editable paths from exercise.json", async () => {
    const manifest = await loadExerciseManifest(
      new URL("../../../exercises/js-variables/exercise.json", import.meta.url),
    );

    expect(manifest.slug).toBe("js-variables");
    expect(manifest.title).toBe("Переменные");
    expect(manifest.language).toBe("javascript");
    expect(manifest.filesToOpen).toEqual(["solution.js"]);
    expect(manifest.studentFiles).toEqual(["solution.js"]);
    expect(manifest.readme).toContain("Dragon");
  });
});

describe("validateStudentFiles", () => {
  const manifest: ExerciseManifest = {
    slug: "demo",
    title: "Demo",
    language: "javascript",
    filesToOpen: ["solution.js"],
    studentFiles: ["solution.js"],
    readme: "Do it",
  };

  it("accepts only whitelisted student paths", () => {
    expect(() =>
      validateStudentFiles(manifest, { "solution.js": "const x = 1;" }),
    ).not.toThrow();
  });

  it("rejects paths outside studentFiles", () => {
    expect(() =>
      validateStudentFiles(manifest, {
        "solution.js": "ok",
        "__tests__/hack.test.js": "evil",
      }),
    ).toThrow(/not allowed/i);
  });

  it("rejects path traversal", () => {
    expect(() =>
      validateStudentFiles(manifest, { "../secret.js": "nope" }),
    ).toThrow(/not allowed/i);
  });
});
