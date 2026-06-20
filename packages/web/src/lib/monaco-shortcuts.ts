type Monaco = Parameters<
  NonNullable<import("@monaco-editor/react").EditorProps["onMount"]>
>[1];

type Editor = Parameters<
  NonNullable<import("@monaco-editor/react").EditorProps["onMount"]>
>[0];

type RegisterEditorHotkeysOptions = {
  editor: Editor;
  monaco: Monaco;
  onRunTests: () => void;
};

export const registerEditorHotkeys = ({
  editor: codeEditor,
  monaco,
  onRunTests,
}: RegisterEditorHotkeysOptions) => {
  codeEditor.addAction({
    id: "ptitsa-run-tests",
    label: "Запустить тесты",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    run: () => {
      onRunTests();
    },
  });

  codeEditor.addAction({
    id: "ptitsa-format-document",
    label: "Форматировать код",
    keybindings: [
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
    ],
    run: async () => {
      await codeEditor.getAction("editor.action.formatDocument")?.run();
    },
  });

  codeEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // Keep focus in editor; student code is already in memory.
  });
};

export { isRunTestsHotkey } from "./exercise-hotkeys";
