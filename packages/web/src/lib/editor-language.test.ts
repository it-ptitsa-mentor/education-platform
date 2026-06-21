import { describe, expect, it } from "vitest";
import { editorLanguageForFile } from "./editor-language.js";
import { isJsxHighlightFile } from "./monaco-setup.js";

describe("editorLanguageForFile", () => {
  it("maps common exercise file extensions", () => {
    expect(editorLanguageForFile("solution.js")).toBe("javascript");
    expect(editorLanguageForFile("src/MyForm.jsx")).toBe("javascript");
    expect(editorLanguageForFile("solution.ts")).toBe("typescript");
    expect(editorLanguageForFile("src/App.tsx")).toBe("typescript");
    expect(editorLanguageForFile("index.html")).toBe("html");
    expect(editorLanguageForFile("styles/app.css")).toBe("css");
    expect(editorLanguageForFile("package.json")).toBe("json");
    expect(editorLanguageForFile("run.sh")).toBe("shell");
  });
});

describe("isJsxHighlightFile", () => {
  it("matches jsx and tsx only", () => {
    expect(isJsxHighlightFile("src/App.jsx")).toBe(true);
    expect(isJsxHighlightFile("src/App.tsx")).toBe(true);
    expect(isJsxHighlightFile("src/App.js")).toBe(false);
    expect(isJsxHighlightFile("src/App.ts")).toBe(false);
  });
});
