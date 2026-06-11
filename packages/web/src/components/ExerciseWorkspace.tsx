import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import type { CheckResult, ExerciseDetail } from "../api";
import { usePanelLayout } from "../hooks/usePanelLayout";
import { ResizeHandle } from "./ResizeHandle";

type ExerciseWorkspaceProps = {
  exercise: ExerciseDetail;
  code: string;
  onCodeChange: (value: string) => void;
  result: CheckResult | null;
};

export const ExerciseWorkspace = ({
  exercise,
  code,
  onCodeChange,
  result,
}: ExerciseWorkspaceProps) => {
  const { layout, setReadmeWidth, setOutputHeight } = usePanelLayout();

  return (
    <main
      className="workspace"
      style={{ gridTemplateColumns: `${layout.readmeWidth}px 6px 1fr` }}
    >
      <aside className="readme-panel panel">
        <div className="panel-head">
          <h2>{exercise.title}</h2>
          <span className="chip">{exercise.language}</span>
        </div>
        <article className="readme prose">
          <ReactMarkdown>{exercise.readme}</ReactMarkdown>
        </article>
      </aside>

      <ResizeHandle
        orientation="horizontal"
        label="Изменить ширину панели задания"
        onResize={(delta) => setReadmeWidth(layout.readmeWidth + delta)}
      />

      <section
        className="editor-stack"
        style={{ gridTemplateRows: `1fr 6px ${layout.outputHeight}px` }}
      >
        <div className="editor-panel panel">
          <div className="panel-head editor-head">
            <div className="tabs">
              {exercise.filesToOpen.map((file) => (
                <button key={file} type="button" className="tab active">
                  {file}
                </button>
              ))}
            </div>
          </div>

          <div className="editor-surface">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => onCodeChange(value ?? "")}
              options={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <ResizeHandle
          orientation="vertical"
          label="Изменить высоту панели вывода"
          onResize={(delta) => setOutputHeight(layout.outputHeight - delta)}
        />

        <div className="output-panel panel">
          <div className="panel-head">
            <h3>Вывод</h3>
            {result && (
              <span
                className={`status-pill ${result.passed ? "pass" : "fail"}`}
              >
                {result.passed ? "Пройдено" : "Есть ошибки"}
              </span>
            )}
          </div>
          <pre className="output-log">
            {result
              ? [result.stdout, result.stderr].filter(Boolean).join("\n") ||
                "Пустой вывод"
              : "Нажмите «Проверить», чтобы запустить тесты."}
          </pre>
        </div>
      </section>
    </main>
  );
};
