type Monaco = Parameters<
  NonNullable<
    import("@monaco-editor/react").EditorProps["beforeMount"]
  >
>[0];

const darkRules = [
  { token: "comment", foreground: "505050", fontStyle: "italic" },
  { token: "keyword", foreground: "d4d4d4", fontStyle: "bold" },
  { token: "string", foreground: "a3a3a3" },
  { token: "number", foreground: "8a8a8a" },
  { token: "identifier", foreground: "e5e5e5" },
  { token: "type", foreground: "fafafa" },
  { token: "function", foreground: "fafafa" },
];

const lightRules = [
  { token: "comment", foreground: "a3a3a3", fontStyle: "italic" },
  { token: "keyword", foreground: "171717", fontStyle: "bold" },
  { token: "string", foreground: "525252" },
  { token: "number", foreground: "737373" },
  { token: "identifier", foreground: "262626" },
  { token: "type", foreground: "0a0a0a" },
  { token: "function", foreground: "0a0a0a" },
];

export const definePtitsaTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme("ptitsa-dark", {
    base: "vs-dark",
    inherit: true,
    rules: darkRules,
    colors: {
      "editor.background": "#00000000",
      "editor.foreground": "#e5e5e5",
      "editor.lineHighlightBackground": "#ffffff05",
      "editorLineNumber.foreground": "#404040",
      "editorLineNumber.activeForeground": "#737373",
      "editor.selectionBackground": "#ffffff22",
      "editor.inactiveSelectionBackground": "#ffffff12",
      "editorCursor.foreground": "#ffffff",
      "editorIndentGuide.background": "#ffffff08",
      "editorIndentGuide.activeBackground": "#ffffff14",
      "editorGutter.background": "#00000000",
      "scrollbarSlider.background": "#ffffff10",
      "scrollbarSlider.hoverBackground": "#ffffff28",
      "minimap.background": "#00000000",
    },
  });

  monaco.editor.defineTheme("ptitsa-light", {
    base: "vs",
    inherit: true,
    rules: lightRules,
    colors: {
      "editor.background": "#ffffff00",
      "editor.foreground": "#262626",
      "editor.lineHighlightBackground": "#00000006",
      "editorLineNumber.foreground": "#c4c4c4",
      "editorLineNumber.activeForeground": "#737373",
      "editor.selectionBackground": "#00000018",
      "editor.inactiveSelectionBackground": "#0000000c",
      "editorCursor.foreground": "#0a0a0a",
      "editorIndentGuide.background": "#0000000c",
      "editorIndentGuide.activeBackground": "#00000018",
      "editorGutter.background": "#ffffff00",
      "scrollbarSlider.background": "#00000012",
      "scrollbarSlider.hoverBackground": "#00000022",
      "minimap.background": "#ffffff00",
    },
  });
};
