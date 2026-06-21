import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { CheckResult, ExerciseDetail } from "../exercise-types";
import { monacoThemeId, useTheme } from "../hooks/useTheme";
import { formatRunTestsHotkey } from "../lib/exercise-hotkeys";
import { markdownComponents } from "../lib/markdown-components";
import { editorLanguageForFile } from "../lib/editor-language";
import { bindJsxSyntaxHighlight, setupMonaco } from "../lib/monaco-setup";
import { registerEditorHotkeys } from "../lib/monaco-shortcuts";
import { usePanelLayout } from "../hooks/usePanelLayout";
import { ResizeHandle } from "./ResizeHandle";

type ExerciseWorkspaceProps = {
  exercise: ExerciseDetail;
  files: Record<string, string>;
  activeFile: string;
  onActiveFileChange: (filePath: string) => void;
  onFileChange: (filePath: string, content: string) => void;
  result: CheckResult | null;
  onRunTests: () => void;
};

export const ExerciseWorkspace = ({
  exercise,
  files,
  activeFile,
  onActiveFileChange,
  onFileChange,
  result,
  onRunTests,
}: ExerciseWorkspaceProps) => {
  const { layout, setReadmeWidth, setOutputHeight } = usePanelLayout();
  const { theme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const jsxCleanupRef = useRef<(() => void) | null>(null);
  const editorPath = `${exercise.slug}/${activeFile}`;
  const editorValue = files[activeFile] ?? "";

  const selectFile = useCallback(
    (nextFile: string) => {
      if (nextFile === activeFile) return;

      const editor = editorRef.current;
      const model = editor?.getModel();
      if (model) {
        onFileChange(activeFile, model.getValue());
      }

      onActiveFileChange(nextFile);
    },
    [activeFile, onActiveFileChange, onFileChange],
  );

  const handleBeforeMount: BeforeMount = (monaco) => {
    setupMonaco(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerEditorHotkeys({ editor, monaco, onRunTests });
    jsxCleanupRef.current?.();
    jsxCleanupRef.current = bindJsxSyntaxHighlight(monaco, editor, activeFile);
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    jsxCleanupRef.current?.();
    jsxCleanupRef.current = bindJsxSyntaxHighlight(monaco, editor, activeFile);

    return () => {
      jsxCleanupRef.current?.();
      jsxCleanupRef.current = null;
    };
  }, [activeFile]);

  return (
    <main
      className="workspace"
      style={{ gridTemplateColumns: `${layout.readmeWidth}px 1px 1fr` }}
    >
      <aside className="readme-panel panel glass-panel">
        <div className="panel-corners" aria-hidden />
        <div className="panel-head">
          <div className="panel-title-group">
            <span className="panel-kicker">01 · BRIEF</span>
            <h2>{exercise.title}</h2>
          </div>
          <span className="chip">{exercise.language}</span>
        </div>
        <article className="readme prose">
          <ReactMarkdown components={markdownComponents}>
            {exercise.readme}
          </ReactMarkdown>
        </article>
      </aside>

      <ResizeHandle
        orientation="horizontal"
        label="Изменить ширину панели задания"
        onResize={(delta) => setReadmeWidth(layout.readmeWidth + delta)}
      />

      <section
        className="editor-stack"
        style={{ gridTemplateRows: `1fr 1px ${layout.outputHeight}px` }}
      >
        <div className="editor-panel panel glass-panel">
          <div className="panel-corners" aria-hidden />
          <div className="panel-head editor-head">
            <div className="tabs" role="tablist" aria-label="Файлы задачи">
              {exercise.filesToOpen.map((file) => (
                <button
                  key={file}
                  type="button"
                  role="tab"
                  aria-selected={file === activeFile}
                  className={`tab${file === activeFile ? " active" : ""}`}
                  onClick={() => selectFile(file)}
                >
                  <span className="tab-dot" aria-hidden />
                  {file}
                </button>
              ))}
            </div>
            <span className="panel-kicker panel-kicker--inline">02 · EDITOR</span>
          </div>

          <div className="editor-surface">
            <Editor
              height="100%"
              path={editorPath}
              language={editorLanguageForFile(activeFile)}
              theme={monacoThemeId(theme)}
              value={editorValue}
              beforeMount={handleBeforeMount}
              onMount={handleEditorMount}
              onChange={(value) => onFileChange(activeFile, value ?? "")}
              options={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                lineHeight: 22,
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                automaticLayout: true,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                roundedSelection: false,
                bracketPairColorization: { enabled: true },
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
              }}
            />
          </div>
        </div>

        <ResizeHandle
          orientation="vertical"
          label="Изменить высоту панели вывода"
          onResize={(delta) => setOutputHeight(layout.outputHeight - delta)}
        />

        <div className="output-panel panel glass-panel">
          <div className="panel-corners" aria-hidden />
          <div className="panel-head">
            <div className="panel-title-group">
              <span className="panel-kicker">03 · OUTPUT</span>
              <h3>Test Runner</h3>
            </div>
            {result && (
              <span
                className={`status-pill ${result.passed ? "pass" : "fail"}`}
              >
                <span className="status-dot" aria-hidden />
                {result.passed ? "PASS" : "FAIL"}
              </span>
            )}
          </div>
          <pre
            className={`output-log ${result ? (result.passed ? "is-pass" : "is-fail") : ""}`}
          >
            {result
              ? [result.stdout, result.stderr].filter(Boolean).join("\n") ||
                "All tests passed — no output."
              : `Press RUN TESTS or ${formatRunTestsHotkey()} to execute.`}
          </pre>
        </div>
      </section>
    </main>
  );
};
