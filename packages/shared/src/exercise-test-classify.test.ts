import { describe, expect, it } from "vitest";
import { classifyExerciseTest } from "./exercise-test-classify.js";
import { generateExerciseTest } from "./exercise-test-generator.js";

const jsManifest = {
  slug: "js-demo",
  studentFiles: ["solution.js"],
  readme: "Сделайте что-нибудь.",
};

const typedManifest = {
  slug: "js-typed-demo",
  studentFiles: ["solution.js"],
  readme:
    'Наберите следующий код символ в символ:\n\n```javascript\nconsole.log("Hello!");\n```\n',
};

describe("classifyExerciseTest", () => {
  it("marks generated smoke test as stub", () => {
    const generated = generateExerciseTest(jsManifest);
    expect(
      classifyExerciseTest(jsManifest, { "solution.test.js": generated ?? "" }),
    ).toBe("stub");
  });

  it("marks generated console test as generated-console", () => {
    const generated = generateExerciseTest(typedManifest);
    expect(
      classifyExerciseTest(typedManifest, {
        "solution.test.js": generated ?? "",
      }),
    ).toBe("generated-console");
  });

  it("marks hand-written assertions as custom", () => {
    const custom = `import { describe, expect, it } from "vitest";
import { sum } from "../solution.js";

describe("sum", () => {
  it("adds numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
`;
    expect(
      classifyExerciseTest(jsManifest, { "solution.test.js": custom }),
    ).toBe("custom");
  });

  it("marks stale generated stub as stub by pattern", () => {
    // Старый вариант сгенерированного smoke: контент не совпадает
    // с текущим генератором, но ассерты только «файл не пустой»
    const stale = `import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("old-stub", () => {
  it("solution", () => {
    const content = readFileSync(path.join(exerciseDir, "solution"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
`;
    expect(
      classifyExerciseTest(jsManifest, { "exercise.test.js": stale }),
    ).toBe("stub");
  });

  it("marks student-authored tests as custom", () => {
    const manifest = {
      slug: "js-tdd-demo",
      studentFiles: ["__tests__/code.test.js"],
      readme: "Напишите тест.",
    };
    expect(classifyExerciseTest(manifest, {})).toBe("custom");
  });

  it("marks exercise without test files as missing", () => {
    expect(classifyExerciseTest(jsManifest, {})).toBe("missing");
  });
});
