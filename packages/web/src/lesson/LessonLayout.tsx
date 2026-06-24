import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import {
  flattenLessons,
  loadCourse,
  readLessonUnits,
  type Course,
  type LessonUnit,
  type Topic,
} from "../course";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import { LessonContext } from "./lesson-context";
import { LessonStepper, LessonUnitNav } from "./LessonStepper";

export const LessonLayout = () => {
  const { moduleSlug = "", topicSlug = "", lessonIndex = "" } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [pickerTopic, setPickerTopic] = useState<Topic | null>(null);

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

  const activeUnit = useMemo((): LessonUnit => {
    if (location.pathname.endsWith("/quiz")) return "quiz";
    if (location.pathname.endsWith("/exercise")) return "exercise";
    return "theory";
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  if (error) {
    return (
      <div className="banner banner-error home-banner">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  }

  if (!course || !current) {
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );
  }

  const { module: mod, topic, lesson } = current;
  const units = readLessonUnits(id);
  void units;

  const refreshProgress = () => setProgressVersion((v) => v + 1);

  const fillMain = activeUnit === "exercise";
  const [asideOpen, setAsideOpen] = useState(!fillMain);

  useEffect(() => {
    setAsideOpen(!fillMain);
  }, [fillMain, location.pathname]);

  const layoutClass = [
    "lesson-layout",
    fillMain ? "lesson-layout--focus" : "",
    fillMain && asideOpen ? "lesson-layout--aside-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <LessonContext.Provider
      value={{
        course,
        current,
        prev,
        next,
        progressVersion,
        refreshProgress,
      }}
    >
      <div className={layoutClass}>
        {fillMain && asideOpen ? (
          <button
            type="button"
            className="lesson-aside-backdrop"
            aria-label="Скрыть модули"
            onClick={() => setAsideOpen(false)}
          />
        ) : null}

        <aside className="lesson-aside" aria-hidden={fillMain && !asideOpen}>
          <Link to="/learn" className="lesson-aside-back">
            ← Все модули
          </Link>
          <p className="lesson-aside-module">{mod.title}</p>
          <ul className="lesson-aside-topics">
            {mod.topics.map((t) => {
              const isCurrent = t.slug === topic.slug;
              return (
                <li key={t.slug}>
                  <button
                    type="button"
                    className={`lesson-aside-topic-btn${isCurrent ? " is-current" : ""}`}
                    onClick={() => setPickerTopic(t)}
                  >
                    {t.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main
          className={`lesson-main${fillMain ? " lesson-main--fill" : ""}`}
        >
          <div
            className={`lesson-main-header${fillMain ? " lesson-main-header--compact" : ""}`}
          >
            {fillMain ? (
              <div className="lesson-main-header-row">
                <button
                  type="button"
                  className="lesson-aside-toggle"
                  aria-expanded={asideOpen}
                  onClick={() => setAsideOpen((open) => !open)}
                >
                  {asideOpen ? "Скрыть модули" : "Модули"}
                </button>
                <h1 className="lesson-title lesson-title--compact">
                  {lesson.title}
                </h1>
                <LessonStepper />
                <LessonUnitNav unit={activeUnit} compact />
              </div>
            ) : (
              <>
                <div className="lesson-breadcrumb">
                  {mod.title} · {topic.title}
                </div>
                <h1 className="lesson-title">{lesson.title}</h1>
                <LessonStepper />
              </>
            )}
          </div>

          <div
            className={`lesson-main-body${fillMain ? " lesson-main-body--fill" : ""}`}
          >
            <Outlet />
          </div>
        </main>

        {pickerTopic && (
          <TopicLessonsModal
            module={mod}
            topic={pickerTopic}
            activeLessonId={id}
            onClose={() => setPickerTopic(null)}
          />
        )}
      </div>
    </LessonContext.Provider>
  );
};

export const LessonIndexRedirect = () => (
  <Navigate to="theory" replace />
);
