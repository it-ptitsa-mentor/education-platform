import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  checkExercise,
  fetchExercise,
  type CheckResult,
  type ExerciseDetail,
} from "../api";
import { ExerciseWorkspace } from "../components/ExerciseWorkspace";
import { useExerciseHotkeys } from "../hooks/useExerciseHotkeys";
import { formatRunTestsHotkey } from "../lib/exercise-hotkeys";

export const ExercisePage = () => {
  const { slug = "" } = useParams();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadExercise = useCallback(async (nextSlug: string) => {
    setError(null);
    setResult(null);
    setExercise(null);
    const detail = await fetchExercise(nextSlug);
    setExercise(detail);
    const primaryFile = detail.filesToOpen[0] ?? "solution.js";
    setCode(detail.files[primaryFile] ?? "");
  }, []);

  useEffect(() => {
    if (!slug) return;
    loadExercise(slug).catch((err: Error) => setError(err.message));
  }, [slug, loadExercise]);

  const handleCheck = useCallback(async () => {
    if (!exercise || checking) return;
    setChecking(true);
    setError(null);
    try {
      const primaryFile = exercise.filesToOpen[0] ?? "solution.js";
      const check = await checkExercise(slug, { [primaryFile]: code });
      setResult(check);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Проверка не удалась");
    } finally {
      setChecking(false);
    }
  }, [checking, code, exercise, slug]);

  useExerciseHotkeys({
    enabled: Boolean(exercise) && !checking,
    onRunTests: () => {
      void handleCheck();
    },
  });

  if (!slug) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Задача не указана.{" "}
        <Link to="/" className="inline-link">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="exercise-page">
      <div className="exercise-toolbar">
        <Link to="/" className="back-link">
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
      </div>

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
          code={code}
          onCodeChange={setCode}
          result={result}
          onRunTests={() => void handleCheck()}
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
