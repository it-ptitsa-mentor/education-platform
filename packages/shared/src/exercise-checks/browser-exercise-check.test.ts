import { describe, expect, it } from "vitest";
import {
  assertCssRules,
  assertHtmlMarkup,
  assertJsxComponent,
  assertNonEmpty,
} from "./file-assertions.js";
import { checkJsConsoleOutput, checkJsModuleLoad } from "./js-runtime-check.js";
import { runBrowserExerciseCheck } from "./browser-exercise-check.js";
import type { ExerciseManifest } from "../exercise-manifest-types.js";

describe("file assertions", () => {
  it("detects empty and jsx component exports", () => {
    expect(assertNonEmpty("  ", "a.js")).toMatch(/empty/i);
    expect(assertJsxComponent("export default function App() {}", "App.jsx")).toBeNull();
    expect(assertJsxComponent("const x = 1", "App.jsx")).toMatch(/export/i);
  });

  it("detects html and css content", () => {
    expect(assertHtmlMarkup("<div></div>", "index.html")).toBeNull();
    expect(assertCssRules(".box { color: red; }", "app.css")).toBeNull();
  });
});

describe("js runtime checks", () => {
  it("matches console output expectations", async () => {
    const result = await checkJsConsoleOutput(
      'console.log("Dragon");\nconsole.log("Dragon");',
      ["Dragon", "Dragon"],
    );

    expect(result.passed).toBe(true);
  });

  it("loads simple js modules from blob urls", async () => {
    const result = await checkJsModuleLoad('console.log("ok");');
    expect(result.passed).toBe(true);
  });
});

describe("runBrowserExerciseCheck", () => {
  const multiFileManifest: ExerciseManifest = {
    slug: "demo-multi",
    title: "Demo",
    language: "javascript",
    filesToOpen: ["src/App.jsx", "src/data.js"],
    studentFiles: ["src/App.jsx", "src/data.js"],
    readme: "demo",
  };

  it("checks every jsx file in jsx-static exercises", async () => {
    const pass = await runBrowserExerciseCheck(multiFileManifest, {
      "src/App.jsx": "export default function App() { return null; }",
      "src/data.js": "export const items = [];",
    });

    expect(pass.passed).toBe(true);

    const fail = await runBrowserExerciseCheck(multiFileManifest, {
      "src/App.jsx": "export default function App() { return null; }",
      "src/data.js": "syntax error {{{",
    });

    expect(fail.passed).toBe(false);
  });

  it("requires all student files in the payload", async () => {
    await expect(
      runBrowserExerciseCheck(multiFileManifest, {
        "src/App.jsx": "export default function App() { return null; }",
      }),
    ).rejects.toThrow(/Missing required files/i);
  });
});
