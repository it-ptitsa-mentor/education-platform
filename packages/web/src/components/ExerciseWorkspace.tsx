import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

/** Prefix used to identify solution-file tabs (invisible to the user). */
const SOL_PREFIX = "__sol__/";

const isSolutionTab = (file: string) => file.startsWith(SOL_PREFIX);
const solutionKey = (file: string) => `${SOL_PREFIX}${file}`;

/** Mobile workspace tab */
type MobileTab = "brief" | "code" | "output";

type ExerciseWorkspaceProps = {
  exercise: ExerciseDetail;
  files: Record<string, string>;
  activeFile: string;
  onActiveFileChange: (filePath: string) => void;
  onFileChange: (filePath: string, content: string) => void;
  result: CheckResult | null;
  onRunTests?: () => void;
  onResetFiles?: () => void;
  headerActions?: ReactNode;
  embedded?: boolean;
  /** Stub exercises show self-check UI instead of RUN TESTS. */
  isStub?: boolean;
  selfCheckDone?: boolean;
  onSelfCheckDone?: () => void;
  /** Solution files to display after «Я справился» — null until revealed. */
  solutionFiles?: Record<string, string>;
  /** Whether tests are currently running (for mobile action button spinner). */
  checking?: boolean;
  /** Mobile fixed-bar nav: URL of previous lesson/unit. */
  mobilePrevHref?: string | null;
  /** Mobile fixed-bar nav: URL of next lesson/unit. */
  mobileNextHref?: string | null;
};

export const ExerciseWorkspace = ({
  exercise,
  files,
  activeFile,
  onActiveFileChange,
  onFileChange,
  result,
  onRunTests,
  onResetFiles,
  headerActions,
  embedded = false,
  isStub = false,
  selfCheckDone = false,
  onSelfCheckDone,
  solutionFiles,
  checking = false,
  mobilePrevHref,
  mobileNextHref,
}: ExerciseWorkspaceProps) => {
  const { layout, setReadmeWidth, setOutputHeight } = usePanelLayout();
  const { theme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const jsxCleanupRef = useRef<(() => void) | null>(null);

  // ── Mobile tab state ──
  const [mobileTab, setMobileTab] = useState<MobileTab>("brief");

  // Reset to brief when exercise changes
  useEffect(() => {
    setMobileTab("brief");
  }, [exercise.slug]);

  // Auto-switch to output tab when test result arrives
  const prevResultRef = useRef<CheckResult | null>(null);
  useEffect(() => {
    if (result !== null && result !== prevResultRef.current) {
      prevResultRef.current = result;
      setMobileTab("output");
    }
    if (result === null) {
      prevResultRef.current = null;
    }
  }, [result]);

  const inSolutionView = isSolutionTab(activeFile);
  const starterFile = inSolutionView ? activeFile.slice(SOL_PREFIX.length) : activeFile;
  const editorPath = `${exercise.slug}/${activeFile}`;
  const editorValue = inSolutionView
    ? (solutionFiles?.[starterFile] ?? "")
    : (files[activeFile] ?? "");

  const selectFile = useCallback(
    (nextFile: string) => {
      if (nextFile === activeFile) return;

      // Persist current starter-file content before switching
      if (!inSolutionView) {
        const editor = editorRef.current;
        const model = editor?.getModel();
        if (model) {
          onFileChange(activeFile, model.getValue());
        }
      }

      onActiveFileChange(nextFile);
    },
    [activeFile, inSolutionView, onActiveFileChange, onFileChange],
  );

  const handleBeforeMount: BeforeMount = (monaco) => {
    setupMonaco(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    if (onRunTests) {
      registerEditorHotkeys({ editor, monaco, onRunTests });
    }
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

  // Force Monaco relayout when code tab becomes visible on mobile
  useEffect(() => {
    if (mobileTab === "code") {
      const editor = editorRef.current;
      // Small delay to let CSS apply before measuring
      const timer = setTimeout(() => {
        editor?.layout();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mobileTab]);

  const readmeColumn = `${layout.readmeWidth}px`;

  // ── Mobile action button (shown in fixed bottom bar) ──
  const mobileActionButton = isStub ? (
    <button
      type="button"
      className={`check-btn self-check-btn workspace-mobile-run-btn${selfCheckDone ? " self-check-btn--done" : ""}`}
      onClick={onSelfCheckDone}
      disabled={checking}
      aria-label="Отметить задание как выполненное"
    >
      <span className="check-btn-icon" aria-hidden>
        {selfCheckDone ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7.5L6 10.5L11 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4.5 7L6.5 9L9.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="check-btn-label">{selfCheckDone ? "ВЫПОЛНЕНО" : "Я СПРАВИЛСЯ"}</span>
    </button>
  ) : (
    <button
      type="button"
      className="check-btn workspace-mobile-run-btn"
      onClick={onRunTests ? () => onRunTests() : undefined}
      disabled={checking || !onRunTests}
      aria-label={`Запустить тесты (${formatRunTestsHotkey()})`}
    >
      <span className="check-btn-icon" aria-hidden>
        {checking ? (
          <span className="spinner" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7.5L6 10.5L11 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="check-btn-label">{checking ? "RUNNING" : "ЗАПУСТИТЬ"}</span>
    </button>
  );

  return (
    <main
      className={`workspace${embedded ? " exercise-workspace" : ""}`}
      style={{ gridTemplateColumns: `${readmeColumn} 8px 1fr` }}
      data-mobile-tab={mobileTab}
    >
      {/* ── Mobile: segment tab control ── */}
      <nav
        className="workspace-mobile-tabs"
        role="tablist"
        aria-label="Переключение секций тренажёра"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "brief"}
          className={`workspace-mobile-tab${mobileTab === "brief" ? " is-active" : ""}`}
          onClick={() => setMobileTab("brief")}
        >
          Условие
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "code"}
          className={`workspace-mobile-tab${mobileTab === "code" ? " is-active" : ""}`}
          onClick={() => setMobileTab("code")}
        >
          Код
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "output"}
          className={`workspace-mobile-tab${mobileTab === "output" ? " is-active" : ""}`}
          onClick={() => setMobileTab("output")}
        >
          Вывод
          {result && (
            <span
              className={`workspace-output-dot workspace-output-dot--${result.passed ? "pass" : "fail"}`}
              aria-hidden
            />
          )}
        </button>
      </nav>

      {/* ── Brief / README panel ── */}
      <aside className="readme-panel panel glass-panel">
        <div className="panel-corners" aria-hidden />
        <div className="panel-head readme-panel-head">
          <div className="panel-title-group">
            <span className="panel-kicker">01 · BRIEF</span>
            <h2>{exercise.title}</h2>
          </div>
          <span className="chip">{exercise.language}</span>
        </div>
        {headerActions ? (
          <div className="readme-panel-actions">{headerActions}</div>
        ) : null}
        <article className="readme prose">
          <ReactMarkdown components={markdownComponents}>
            {exercise.readme}
          </ReactMarkdown>
        </article>
      </aside>

      {/* ── Horizontal resize handle (desktop only via CSS) ── */}
      <ResizeHandle
        orientation="horizontal"
        label="Изменить ширину панели задания"
        onResize={(delta) => setReadmeWidth(layout.readmeWidth + delta)}
      />

      {/* ── Editor + Output stack ── */}
      <section
        className="editor-stack"
        style={{ gridTemplateRows: `1fr 8px ${layout.outputHeight}px` }}
      >
        <div className="editor-panel panel glass-panel">
          <div className="panel-corners" aria-hidden />
          <div className="panel-head editor-head">
            <div className="tabs" role="tablist" aria-label="Файлы задачи">
              {/* Starter file tabs */}
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
              {/* Solution tabs — revealed only after «Я справился» */}
              {solutionFiles &&
                Object.keys(solutionFiles).map((file) => (
                  <button
                    key={solutionKey(file)}
                    type="button"
                    role="tab"
                    aria-selected={activeFile === solutionKey(file)}
                    className={`tab tab--solution${activeFile === solutionKey(file) ? " active" : ""}`}
                    onClick={() => selectFile(solutionKey(file))}
                  >
                    <span className="tab-dot" aria-hidden />
                    <span className="tab-solution-label">{file}</span>
                    <span className="tab-solution-badge">эталон</span>
                  </button>
                ))}
            </div>
            <div className="panel-head-trail">
              {onResetFiles ? (
                <button
                  type="button"
                  className="editor-reset-btn"
                  onClick={onResetFiles}
                  title="Сбросить код к начальному состоянию"
                >
                  ↺ Сброс
                </button>
              ) : null}
              <span className="panel-kicker panel-kicker--inline">02 · EDITOR</span>
            </div>
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
              onChange={(value) => {
                // Never write back when viewing a read-only solution tab
                if (!inSolutionView) {
                  onFileChange(activeFile, value ?? "");
                }
              }}
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
                readOnly: inSolutionView,
              }}
            />
          </div>
        </div>

        {/* Vertical resize handle (desktop only via CSS) */}
        <ResizeHandle
          orientation="vertical"
          label="Изменить высоту панели вывода"
          onResize={(delta) => setOutputHeight(layout.outputHeight - delta)}
        />

        <div className="output-panel panel glass-panel">
          <div className="panel-corners" aria-hidden />
          {isStub ? (
            /* ── Self-check output panel ── */
            <>
              <div className="panel-head">
                <div className="panel-title-group">
                  <span className="panel-kicker">03 · OUTPUT</span>
                  <h3>Самопроверка</h3>
                </div>
                {selfCheckDone && (
                  <span className="status-pill pass">
                    <span className="status-dot" aria-hidden />
                    ВЫПОЛНЕНО
                  </span>
                )}
              </div>
              <div className="self-check-output-body">
                {selfCheckDone ? (
                  <p className="self-check-msg self-check-msg--done">
                    ✓ Ты отметил задание как выполненное.
                    {solutionFiles
                      ? " Вкладки с эталонным решением открыты в редакторе."
                      : ""}
                  </p>
                ) : (
                  <>
                    <p className="self-check-msg">
                      Это задание без автопроверки — реши задачу по условию,
                      затем нажми «Я справился».
                    </p>
                    <button
                      type="button"
                      className="check-btn self-check-btn"
                      onClick={onSelfCheckDone}
                    >
                      <span className="check-btn-icon" aria-hidden>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle
                            cx="7"
                            cy="7"
                            r="5.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4.5 7L6.5 9L9.5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="check-btn-label">Я СПРАВИЛСЯ</span>
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            /* ── Normal test output ── */
            <>
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
                  : (
                    <>
                      {"Нажмите «Запустить», чтобы проверить решение"}
                      <span className="output-log-hotkey-hint">
                        {" "}или {formatRunTestsHotkey()}
                      </span>
                    </>
                  )}
              </pre>
            </>
          )}
        </div>
      </section>

      {/* ── Mobile: fixed bottom action bar ── */}
      <div className="workspace-mobile-bar" aria-label="Действия тренажёра">
        {/* Left: prev/next lesson navigation */}
        <div className="workspace-mobile-nav">
          {mobilePrevHref ? (
            <Link
              to={mobilePrevHref}
              className="workspace-mobile-nav-btn"
              aria-label="Предыдущий урок"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M12 5L7 10L12 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span
              className="workspace-mobile-nav-btn workspace-mobile-nav-btn--disabled"
              aria-disabled="true"
              aria-label="Нет предыдущего урока"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M12 5L7 10L12 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          {mobileNextHref ? (
            <Link
              to={mobileNextHref}
              className="workspace-mobile-nav-btn"
              aria-label="Следующий урок"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M8 5L13 10L8 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span
              className="workspace-mobile-nav-btn workspace-mobile-nav-btn--disabled"
              aria-disabled="true"
              aria-label="Нет следующего урока"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M8 5L13 10L8 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Right: main action button */}
        <div className="workspace-mobile-action">
          {mobileActionButton}
        </div>
      </div>
    </main>
  );
};
