import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../lib/markdown-components";
import {
  loadCourse,
  loadTheory,
  flattenLessons,
  readProgress,
  markLessonDone,
  type Course,
} from "../course";

export const LessonPage = () => {
  const { moduleSlug = "", topicSlug = "", lessonIndex = "" } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [theory, setTheory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // ре-рендер прогресса

  useEffect(() => {
    loadCourse()
      .then(setCourse)
      .catch((e: Error) => setError(e.message));
  }, []);

  const lessons = useMemo(
    () => (course ? flattenLessons(course) : []),
    [course],
  );
  const id = `${moduleSlug}/${topicSlug}/${lessonIndex}`;
  const pos = lessons.findIndex((l) => l.id === id);
  const current = pos >= 0 ? lessons[pos] : null;
  const prev = pos > 0 ? lessons[pos - 1] : null;
  const next = pos >= 0 && pos < lessons.length - 1 ? lessons[pos + 1] : null;

  useEffect(() => {
    if (!current) return;
    setTheory("");
    loadTheory(current.lesson.theory)
      .then(setTheory)
      .catch(() => setTheory("_Не удалось загрузить теорию._"));
    window.scrollTo({ top: 0 });
  }, [current?.id]);

  if (error)
    return (
      <div className="banner banner-error home-banner">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  if (!course || !current)
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );

  const progress = readProgress();
  const { module: mod, topic, lesson } = current;
  void tick;

  const complete = () => {
    markLessonDone(id, true);
    setTick((t) => t + 1);
  };

  return (
    <div className="lesson-layout">
      {/* ── боковое дерево курса ── */}
      <aside className="lesson-aside">
        <Link to="/learn" className="lesson-aside-back">
          ← Все модули
        </Link>
        {mod.topics.map((t) => (
          <div key={t.slug} className="lesson-aside-topic">
            <div className="lesson-aside-topic-title">{t.title}</div>
            <ul>
              {t.lessons.map((l) => {
                const lid = `${mod.slug}/${t.slug}/${l.index}`;
                const active = lid === id;
                return (
                  <li key={l.index}>
                    <Link
                      to={`/learn/${lid}`}
                      className={`lesson-aside-item${active ? " is-active" : ""}`}
                    >
                      <span
                        className={`lesson-aside-dot${progress[lid] ? " is-done" : ""}`}
                        aria-hidden
                      >
                        {progress[lid] ? "✓" : ""}
                      </span>
                      {l.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* ── центр: урок ── */}
      <main className="lesson-main">
        <div className="lesson-breadcrumb">
          {mod.title} · {topic.title}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>

        <div className="lesson-steps">
          <span className="lesson-step is-active">① Теория</span>
          <span className={`lesson-step${lesson.quiz ? "" : " is-off"}`}>
            ② Квиз
          </span>
          <span className={`lesson-step${lesson.exercise ? "" : " is-off"}`}>
            ③ Практика
          </span>
        </div>

        <article className="lesson-theory prose">
          <ReactMarkdown components={markdownComponents}>{theory}</ReactMarkdown>
        </article>

        <div className="lesson-actions">
          {lesson.quiz && (
            <Link to={`/quiz/${lesson.quiz}`} className="lesson-cta lesson-cta--quiz">
              ❓ Пройти квиз
            </Link>
          )}
          {lesson.exercise && (
            <Link
              to={`/exercise/${lesson.exercise}`}
              className="lesson-cta lesson-cta--practice"
            >
              💻 Решать задачу
            </Link>
          )}
          <button type="button" className="lesson-cta lesson-cta--done" onClick={complete}>
            {progress[id] ? "✓ Пройден" : "Отметить пройденным"}
          </button>
        </div>

        <nav className="lesson-nav">
          {prev ? (
            <Link to={`/${prev.href}`} className="lesson-nav-link">
              ← {prev.lesson.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/${next.href}`} className="lesson-nav-link lesson-nav-link--next">
              {next.lesson.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
};
