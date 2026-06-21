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
import { fetchQuizzes, type QuizSummary } from "../api";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 24;

const isTrackId = (value: string | null): value is ExerciseTrackId =>
  EXERCISE_TRACKS.some((track) => track.id === value);

export const QuizzesHomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const trackParam = searchParams.get("track");
  const activeTrack: ExerciseTrackId = isTrackId(trackParam)
    ? trackParam
    : "javascript";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  useEffect(() => {
    fetchQuizzes()
      .then((data) => setQuizzes(data.quizzes))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const trackCounts = useMemo(() => countExercisesByTrack(quizzes), [quizzes]);

  const trackQuizzes = useMemo(
    () => sortExercisesForCatalog(filterExercisesByTrack(quizzes, activeTrack)),
    [quizzes, activeTrack],
  );

  const pagination = useMemo(
    () => paginateItems(trackQuizzes, { page, pageSize: PAGE_SIZE }),
    [trackQuizzes, page],
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
        <span className="loading-text">LOADING QUIZZES</span>
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
        <p className="home-kicker">QUIZZES · {quizzes.length} LESSONS</p>
        <h2 className="home-title">Квизы по урокам</h2>
        <p className="home-lead">
          Тесты из Hexlet после теории: один или несколько правильных ответов на
          вопрос. Разделы совпадают с каталогом задач. Практика в коде — в разделе{" "}
          <Link to="/" className="inline-link">
            Задачи
          </Link>
          .
        </p>
      </section>

      <div className="track-tabs" role="tablist" aria-label="Разделы квизов">
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

      <section className="track-panel" aria-labelledby={`quiz-track-${activeTrack}`}>
        <header className="track-panel-head">
          <div>
            <p className="track-panel-kicker" id={`quiz-track-${activeTrack}`}>
              SECTION
            </p>
            <h3 className="track-panel-title">{activeTrackLabel}</h3>
          </div>
          <span className="track-panel-total">{trackQuizzes.length} квизов</span>
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
            {pagination.items.map((quiz) => (
              <li key={quiz.slug}>
                <Link to={`/quiz/${quiz.slug}`} className="exercise-card exercise-card--quiz">
                  <span className="exercise-card-lang">QZ</span>
                  <span className="exercise-card-body">
                    <span className="exercise-card-course">{quiz.categoryName}</span>
                    <span className="exercise-card-title">{quiz.title}</span>
                  </span>
                  <span className="exercise-card-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="track-empty">В этом разделе пока нет квизов.</p>
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
