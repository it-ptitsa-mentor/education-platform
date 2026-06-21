import { MonacoJsxSyntaxHighlight, getWorker } from "monaco-jsx-syntax-highlight";
import { configureMonacoLanguages } from "./configure-monaco";
import { definePtitsaTheme } from "./monaco-theme";

type Monaco = Parameters<
  NonNullable<import("@monaco-editor/react").EditorProps["onMount"]>
>[1];

type Editor = Parameters<
  NonNullable<import("@monaco-editor/react").EditorProps["onMount"]>
>[0];

let jsxController: MonacoJsxSyntaxHighlight | null = null;

export const setupMonaco = (monaco: Monaco) => {
  configureMonacoLanguages(monaco);
  definePtitsaTheme(monaco);
};

export const isJsxHighlightFile = (filePath: string) =>
  /\.(jsx|tsx)$/i.test(filePath);

export const bindJsxSyntaxHighlight = (
  monaco: Monaco,
  editor: Editor,
  filePath: string,
) => {
  if (!isJsxHighlightFile(filePath)) {
    return () => {};
  }

  if (!jsxController) {
    jsxController = new MonacoJsxSyntaxHighlight(getWorker(), monaco);
  }

  const { highlighter, dispose } = jsxController.highlighterBuilder({
    editor,
    filePath,
  });

  highlighter();
  const subscription = editor.onDidChangeModelContent(() => highlighter());

  return () => {
    subscription.dispose();
    dispose();
  };
};
