import { describe, expect, it } from "vitest";
import {
  assertCssRules,
  assertHtmlMarkup,
  assertJsxComponent,
  assertNonEmpty,
  assertRequiredClasses,
  assertRequiredSelectors,
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

describe("assertRequiredClasses / assertRequiredSelectors (unit)", () => {
  it("assertRequiredClasses: returns null for every present class", () => {
    const html = '<button class="btn d-flex flex-center text-white"><img class="mr-1" /></button>';
    const results = assertRequiredClasses(html, ["btn", "d-flex", "flex-center", "mr-1"]);
    expect(results).toEqual([null, null, null, null]);
  });

  it("assertRequiredClasses: returns error for each missing class", () => {
    const html = "<body><p>hello world</p></body>";
    const results = assertRequiredClasses(html, ["btn", "d-flex"]);
    expect(results[0]).toMatch(/btn/);
    expect(results[1]).toMatch(/d-flex/);
  });

  it("assertRequiredSelectors: returns null for each present selector", () => {
    const css = ".d-flex { display: flex; }\n.flex-center { align-items: center; }";
    const results = assertRequiredSelectors(css, [".d-flex", ".flex-center"]);
    expect(results).toEqual([null, null]);
  });

  it("assertRequiredSelectors: returns error for each missing selector", () => {
    const css = ".btn { padding: 8px; }";
    const results = assertRequiredSelectors(css, [".d-flex", ".flex-center"]);
    expect(results[0]).toMatch(/\.d-flex/);
    expect(results[1]).toMatch(/\.flex-center/);
  });
});

describe("runBrowserExerciseCheck — structural checks (html-content)", () => {
  const htmlManifestWithClasses: ExerciseManifest = {
    slug: "css-flex-align-items",
    title: "Выравнивание по осям",
    language: "html",
    filesToOpen: ["index.html", "styles/app.css"],
    studentFiles: ["index.html", "styles/app.css"],
    readme: "exercise",
    expectedClasses: ["btn", "d-flex", "flex-center", "text-white", "mr-1"],
    expectedSelectors: [".d-flex", ".flex-center", ".text-white", ".mr-1"],
  };

  const CORRECT_HTML =
    '<button class="btn d-flex flex-center text-white"><img src="img.png" class="mr-1" /><span>Принять</span></button>';
  const CORRECT_CSS =
    ".btn { padding: 8px; } .d-flex { display: flex; } .flex-center { align-items: center; justify-content: center; } .text-white { color: #fff; } .mr-1 { margin-right: 1em; }";

  it("PASS: correct solution has all required classes and selectors", async () => {
    const result = await runBrowserExerciseCheck(htmlManifestWithClasses, {
      "index.html": `<!DOCTYPE html><html><head></head><body>${CORRECT_HTML}</body></html>`,
      "styles/app.css": CORRECT_CSS,
    });
    expect(result.passed).toBe(true);
  });

  it("FAIL: valid HTML without required classes → rejects (fixes the bug)", async () => {
    const result = await runBrowserExerciseCheck(htmlManifestWithClasses, {
      "index.html": "<body><p>hello world</p></body>",
      "styles/app.css": "p { color: red; }",
    });
    expect(result.passed).toBe(false);
    expect(result.stderr).toMatch(/btn|d-flex/);
  });

  it("FAIL: CSS missing required selectors → rejects", async () => {
    const result = await runBrowserExerciseCheck(htmlManifestWithClasses, {
      "index.html": `<!DOCTYPE html><html><body>${CORRECT_HTML}</body></html>`,
      "styles/app.css": ".btn { padding: 8px; }",
    });
    expect(result.passed).toBe(false);
    expect(result.stderr).toMatch(/\.d-flex|\.flex-center/);
  });
});

describe("runBrowserExerciseCheck — structural checks (css-content)", () => {
  const cssManifestWithSelectors: ExerciseManifest = {
    slug: "css-flex-justify-content",
    title: "Выравнивание по главной оси",
    language: "html",
    filesToOpen: ["styles/app.css"],
    studentFiles: ["styles/app.css"],
    readme: "exercise",
    expectedSelectors: [".container"],
  };

  it("PASS: correct CSS with required selector", async () => {
    const result = await runBrowserExerciseCheck(cssManifestWithSelectors, {
      "styles/app.css":
        ".container { display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; }",
    });
    expect(result.passed).toBe(true);
  });

  it("FAIL: valid CSS without required selector → rejects (fixes the bug)", async () => {
    const result = await runBrowserExerciseCheck(cssManifestWithSelectors, {
      "styles/app.css": "p { color: red; }",
    });
    expect(result.passed).toBe(false);
    expect(result.stderr).toMatch(/\.container/);
  });
});
