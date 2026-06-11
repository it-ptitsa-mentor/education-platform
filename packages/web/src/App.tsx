import { useCallback, useEffect, useState } from "react";
import {
  checkExercise,
  fetchExercise,
  fetchExercises,
  type CheckResult,
  type ExerciseDetail,
  type ExerciseSummary,
} from "./api";
import { ExercisePicker } from "./components/ExercisePicker";
import { ExerciseWorkspace } from "./components/ExerciseWorkspace";

const DEFAULT_SLUG = "js-variables";

export const App = () => {
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [slug, setSlug] = useState(DEFAULT_SLUG);
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadExercise = useCallback(async (nextSlug: string) => {
    setError(null);
    setResult(null);
    const detail = await fetchExercise(nextSlug);
    setExercise(detail);
    setCode(detail.files["solution.js"] ?? "");
  }, []);

  useEffect(() => {
    fetchExercises()
      .then((data) => setExercises(data.exercises))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    loadExercise(slug).catch((err: Error) => setError(err.message));
  }, [slug, loadExercise]);

  const handleCheck = async () => {
    if (!exercise) return;
    setChecking(true);
    setError(null);
    try {
      const check = await checkExercise(slug, { "solution.js": code });
      setResult(check);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Проверка не удалась");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="grain" aria-hidden />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">пт</span>
          <div>
            <p className="brand-eyebrow">IT Птица Mentor</p>
            <h1>Тренажёр</h1>
          </div>
        </div>

        <div className="control-dock">
          <ExercisePicker
            exercises={exercises}
            slug={slug}
            onChange={setSlug}
          />
          <button
            type="button"
            className="check-btn"
            onClick={handleCheck}
            disabled={checking || !exercise}
          >
            {checking ? "…" : "Проверить"}
          </button>
        </div>
      </header>

      {error && <div className="banner banner-error">{error}</div>}

      {exercise ? (
        <ExerciseWorkspace
          exercise={exercise}
          code={code}
          onCodeChange={setCode}
          result={result}
        />
      ) : (
        <div className="loading">Загружаем упражнение…</div>
      )}
    </div>
  );
};
