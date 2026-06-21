import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  EXERCISE_TRACKS,
  countExercisesByTrack,
  filterExercisesByTrack,
  paginateItems,
  sortExercisesForCatalog,
  type ExerciseTrackId,
} from "@ptitsa/shared/exercise-tracks";
import { fetchExercises, type ExerciseSummary } from "../api";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 24;

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JS",
  html: "HTML",
  shell: "SH",
};

const isTrackId = (value: string | null): value is ExerciseTrackId =>
  EXERCISE_TRACKS.some((track) => track.id === value);

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const trackParam = searchParams.get("track");
  const activeTrack: ExerciseTrackId = isTrackId(trackParam)
    ? trackParam
    : "javascript";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  useEffect(() => {
    fetchExercises()
      .then((data) => setExercises(data.exercises))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const trackCounts = useMemo(() => countExercisesByTrack(exercises), [exercises]);

  const trackExercises = useMemo(
    () => sortExercisesForCatalog(filterExercisesByTrack(exercises, activeTrack)),
    [exercises, activeTrack],
  );

  const pagination = useMemo(
    () => paginateItems(trackExercises, { page, pageSize: PAGE_SIZE }),
    [trackExercises, page],
  );

  useEffect(() => {
    if (page !== pagination.page) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set("page", String(pagination.page));
          return next;
        },
        { replace: true },
      );
    }
  }, [page, pagination.page, setSearchParams]);

  const setTrack = (trackId: ExerciseTrackId) => {
    setSearchParams({ track: trackId, page: "1" });
  };

  const setPage = (nextPage: number) => {
    setSearchParams({ track: activeTrack, page: String(nextPage) });
  };

  if (loading) {
    return (
      <div className="loading home-loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">LOADING CATALOG</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        {error}
      </div>
    );
  }

  const activeTrackLabel =
    EXERCISE_TRACKS.find((track) => track.id === activeTrack)?.label ?? activeTrack;

  return (
    <main className="home">
      <section className="home-hero">
        <p className="home-kicker">CATALOG · {exercises.length} TASKS</p>
        <h2 className="home-title">Выберите задачу</h2>
        <p className="home-lead">
          Разделы по стеку: JavaScript, React и HTML + CSS. Внутри раздела —
          постраничный список задач по курсам. Тесты после теории — в разделе{" "}
          <Link to="/quizzes" className="inline-link">
            Квизы
          </Link>
          .
        </p>
      </section>

      <div className="track-tabs" role="tablist" aria-label="Разделы каталога">
        {EXERCISE_TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            role="tab"
            className={`track-tab${activeTrack === track.id ? " is-active" : ""}`}
            aria-selected={activeTrack === track.id}
            onClick={() => setTrack(track.id)}
          >
            <span className="track-tab-label">{track.label}</span>
            <span className="track-tab-count">{trackCounts[track.id]}</span>
          </button>
        ))}
      </div>

      <section className="track-panel" aria-labelledby={`track-${activeTrack}`}>
        <header className="track-panel-head">
          <div>
            <p className="track-panel-kicker" id={`track-${activeTrack}`}>
              SECTION
            </p>
            <h3 className="track-panel-title">{activeTrackLabel}</h3>
          </div>
          <span className="track-panel-total">
            {trackExercises.length} задач
          </span>
        </header>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />

        {pagination.items.length > 0 ? (
          <ul className="exercise-grid">
            {pagination.items.map((exercise) => (
              <li key={exercise.slug}>
                <Link
                  to={`/exercise/${exercise.slug}`}
                  className="exercise-card"
                >
                  <span className="exercise-card-lang">
                    {LANGUAGE_LABELS[exercise.language] ?? exercise.language}
                  </span>
                  <span className="exercise-card-body">
                    <span className="exercise-card-course">
                      {exercise.categoryName}
                    </span>
                    <span className="exercise-card-title">{exercise.title}</span>
                  </span>
                  <span className="exercise-card-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="track-empty">В этом разделе пока нет задач.</p>
        )}

        {pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </section>
    </main>
  );
};
