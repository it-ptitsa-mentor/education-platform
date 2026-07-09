import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  checkExercise,
  fetchExercise,
  type CheckResult,
  type ExerciseDetail,
} from "../api";
import { ExerciseWorkspace } from "./ExerciseWorkspace";
import { useExerciseHotkeys } from "../hooks/useExerciseHotkeys";
import { formatRunTestsHotkey } from "../lib/exercise-hotkeys";

const primaryFile = (exercise: Pick<ExerciseDetail, "filesToOpen">) =>
  exercise.filesToOpen[0] ?? "solution.js";

// ── черновики кода в localStorage (per-slug), переживают refresh ──

const draftKey = (slug: string) => `ptitsa.trainer.draft.v1:${slug}`;

const readDraft = (slug: string): Record<string, string> | null => {
  try {
    const raw = localStorage.getItem(draftKey(slug));
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
};

const writeDraft = (slug: string, files: Record<string, string>) => {
  try {
    localStorage.setItem(draftKey(slug), JSON.stringify(files));
  } catch {
    // квота/приватный режим — черновик просто не сохранится
  }
};

const clearDraft = (slug: string) => {
  try {
    localStorage.removeItem(draftKey(slug));
  } catch {
    // ignore
  }
};

/** Наложить черновик на стартер: берём только файлы, которые есть в задании. */
const mergeDraft = (
  starter: Record<string, string>,
  draft: Record<string, string> | null,
): Record<string, string> => {
  if (!draft) return starter;
  const merged = { ...starter };
  for (const [file, content] of Object.entries(draft)) {
    if (file in merged && typeof content === "string") {
      merged[file] = content;
    }
  }
  return merged;
};

// ── Self-check progress in localStorage ──

const selfCheckKey = (slug: string) => `ptitsa.trainer.selfcheck.v1:${slug}`;

const readSelfCheck = (slug: string): boolean => {
  try {
    return localStorage.getItem(selfCheckKey(slug)) === "done";
  } catch {
    return false;
  }
};

const writeSelfCheck = (slug: string) => {
  try {
    localStorage.setItem(selfCheckKey(slug), "done");
  } catch {
    // ignore
  }
};

type ExerciseRunnerProps = {
  slug: string;
  embedded?: boolean;
  onPassed?: () => void;
  /** Mobile bottom-bar navigation hrefs (passed through to ExerciseWorkspace). */
  mobilePrevHref?: string | null;
  mobileNextHref?: string | null;
};

export const ExerciseRunner = ({
  slug,
  embedded = false,
  onPassed,
  mobilePrevHref,
  mobileNextHref,
}: ExerciseRunnerProps) => {
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passedNotified, setPassedNotified] = useState(false);
  const [selfCheckDone, setSelfCheckDone] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const isStub = (exercise?.testClass ?? "missing") === "stub";

  const loadExercise = useCallback(async (nextSlug: string) => {
    setError(null);
    setResult(null);
    setExercise(null);
    setPassedNotified(false);
    setShowSolution(false);
    const done = readSelfCheck(nextSlug);
    setSelfCheckDone(done);
    const detail = await fetchExercise(nextSlug);
    setExercise(detail);
    setFiles(mergeDraft(detail.files, readDraft(nextSlug)));
    setActiveFile(primaryFile(detail));
  }, []);

  useEffect(() => {
    if (!slug) return;
    loadExercise(slug).catch((err: Error) => setError(err.message));
  }, [slug, loadExercise]);

  useEffect(() => {
    if (result?.passed && onPassed && !passedNotified) {
      setPassedNotified(true);
      onPassed();
    }
  }, [onPassed, passedNotified, result]);

  const handleFileChange = useCallback(
    (filePath: string, content: string) => {
      setFiles((current) => {
        const next = { ...current, [filePath]: content };
        writeDraft(slug, next);
        return next;
      });
    },
    [slug],
  );

  const handleResetFiles = useCallback(() => {
    if (!exercise) return;
    clearDraft(slug);
    setFiles(exercise.files);
    setResult(null);
  }, [exercise, slug]);

  const handleCheck = useCallback(async () => {
    if (!exercise || checking || isStub) return;
    setChecking(true);
    setError(null);
    try {
      const check = await checkExercise(slug, files);
      setResult(check);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Проверка не удалась");
    } finally {
      setChecking(false);
    }
  }, [checking, exercise, files, isStub, slug]);

  const handleSelfCheckDone = useCallback(() => {
    writeSelfCheck(slug);
    setSelfCheckDone(true);
    setShowSolution(true);
    onPassed?.();
  }, [onPassed, slug]);

  // Hotkeys only for non-stub exercises
  useExerciseHotkeys({
    enabled: Boolean(exercise) && !checking && !isStub,
    onRunTests: () => {
      void handleCheck();
    },
  });

  if (!slug) {
    return (
      <div className="banner banner-error" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Задача не указана.
      </div>
    );
  }

  // ── Self-check button (for stub exercises) ──
  const selfCheckButton = (
    <button
      type="button"
      className={`check-btn self-check-btn${selfCheckDone ? " self-check-btn--done" : ""}`}
      onClick={handleSelfCheckDone}
      disabled={!exercise}
      title="Отметить задание как выполненное"
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
      <span className="check-btn-label">
        {selfCheckDone ? "ВЫПОЛНЕНО" : "Я СПРАВИЛСЯ"}
      </span>
    </button>
  );

  // ── Normal RUN TESTS button ──
  const runTestsButton = (
    <button
      type="button"
      className="check-btn"
      onClick={() => void handleCheck()}
      disabled={checking || !exercise}
      title={`Запустить тесты (${formatRunTestsHotkey()})`}
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
      <span className="check-btn-label">
        {checking ? "RUNNING" : "RUN TESTS"}
      </span>
      <kbd className="check-btn-hotkey">{formatRunTestsHotkey()}</kbd>
    </button>
  );

  const actionButton = isStub ? selfCheckButton : runTestsButton;

  return (
    <div className={`exercise-runner${embedded ? " exercise-runner--embedded" : ""}`}>
      {!embedded ? (
        <div className="exercise-toolbar">
          <Link to="/tasks" className="back-link">
            <span aria-hidden>←</span>
            Каталог
          </Link>

          <div className="exercise-toolbar-title">
            {exercise ? (
              <>
                <span className="exercise-toolbar-kicker">TASK</span>
                <span className="exercise-toolbar-name">{exercise.title}</span>
              </>
            ) : (
              <span className="exercise-toolbar-name exercise-toolbar-name--muted">
                LOADING
              </span>
            )}
          </div>

          {isStub && (
            <span className="no-autocheck-badge" title="Это задание проверяется самостоятельно">
              без автопроверки
            </span>
          )}

          {actionButton}
        </div>
      ) : null}

      {error && (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon" aria-hidden>
            !
          </span>
          <span className="banner-label">ERR</span>
          {error}
        </div>
      )}

      {exercise ? (
        <ExerciseWorkspace
          exercise={exercise}
          files={files}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
          onFileChange={handleFileChange}
          result={isStub ? null : result}
          onRunTests={isStub ? undefined : () => void handleCheck()}
          onResetFiles={handleResetFiles}
          headerActions={embedded ? actionButton : undefined}
          embedded={embedded}
          isStub={isStub}
          selfCheckDone={selfCheckDone}
          onSelfCheckDone={handleSelfCheckDone}
          solutionFiles={showSolution ? exercise.solutionFiles : undefined}
          checking={checking}
          mobilePrevHref={mobilePrevHref}
          mobileNextHref={mobileNextHref}
        />
      ) : (
        !error && (
          <div className="loading">
            <span className="spinner spinner-lg" aria-hidden />
            <span className="loading-text">INITIALIZING</span>
          </div>
        )
      )}
    </div>
  );
};
