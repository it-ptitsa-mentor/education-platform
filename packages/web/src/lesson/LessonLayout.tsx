import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import {
  flattenLessons,
  loadCourse,
  type Course,
  type LessonRef,
} from "../course";
import {
  activeUnitFromPath,
  lessonUnitPath,
} from "../lib/lesson-units";
import { LessonContext } from "./lesson-context";
import { LessonCourseSidebar } from "./LessonCourseSidebar";
import { LessonSideNav } from "./LessonSideNav";
import { LessonStepper } from "./LessonStepper";

const findTopic = (course: Course, moduleSlug: string, topicSlug: string) => {
  const mod = course.modules.find((m) => m.slug === moduleSlug);
  const topic = mod?.topics.find((t) => t.slug === topicSlug);
  if (!mod || !topic) return null;
  return { mod, topic };
};

const findLessonRef = (
  topicLessons: LessonRef[],
  lessonIndex: number,
): LessonRef | null =>
  topicLessons.find((l) => l.lesson.index === lessonIndex) ?? null;

export const LessonLayout = () => {
  const { moduleSlug = "", topicSlug = "", lessonIndex = "1" } = useParams();
  const location = useLocation();
  const parsedIndex = Number.parseInt(lessonIndex, 10) || 1;
  const activeUnit = activeUnitFromPath(location.pathname);

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [asideOpen, setAsideOpen] = useState(false);

  useEffect(() => {
    loadCourse()
      .then(setCourse)
      .catch((e: Error) => setError(e.message));
  }, []);

  const allLessons = useMemo(
    () => (course ? flattenLessons(course) : []),
    [course],
  );

  const topicEntry = course ? findTopic(course, moduleSlug, topicSlug) : null;

  const topicLessons = useMemo(
    () =>
      allLessons.filter(
        (l) => l.module.slug === moduleSlug && l.topic.slug === topicSlug,
      ),
    [allLessons, moduleSlug, topicSlug],
  );

  const current = useMemo(
    () => findLessonRef(topicLessons, parsedIndex),
    [topicLessons, parsedIndex],
  );

  const prev = useMemo(() => {
    if (!current) return null;
    const pos = allLessons.findIndex((l) => l.id === current.id);
    return pos > 0 ? allLessons[pos - 1] : null;
  }, [allLessons, current]);

  const next = useMemo(() => {
    if (!current) return null;
    const pos = allLessons.findIndex((l) => l.id === current.id);
    return pos >= 0 && pos < allLessons.length - 1
      ? allLessons[pos + 1]
      : null;
  }, [allLessons, current]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.querySelector(".app-main")?.scrollTo({ top: 0 });
  }, [moduleSlug, topicSlug, lessonIndex, activeUnit]);

  if (error) {
    return (
      <div className="banner banner-error home-banner">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );
  }

  if (!topicEntry) {
    return (
      <div className="banner banner-error home-banner">
        <span className="banner-label">404</span> Тема не найдена.{" "}
        <Link to="/">Вернуться к роадмапу</Link>
      </div>
    );
  }

  if (!current) {
    const first = topicLessons[0];
    if (first) {
      return (
        <Navigate to={lessonUnitPath(first, "theory")} replace />
      );
    }
    return (
      <div className="banner banner-error home-banner">
        <span className="banner-label">ERR</span> Урок не найден
      </div>
    );
  }

  const { mod, topic } = topicEntry;
  const refreshProgress = () => setProgressVersion((v) => v + 1);
  const isExerciseFocus = activeUnit === "exercise";

  return (
    <LessonContext.Provider
      value={{
        course,
        module: mod,
        topic,
        current,
        topicLessons,
        allLessons,
        prev,
        next,
        progressVersion,
        refreshProgress,
      }}
    >
      <div
        className={[
          "lesson-layout",
          isExerciseFocus ? "lesson-layout--focus" : "",
          asideOpen ? "lesson-layout--aside-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <LessonCourseSidebar
          activeUnit={activeUnit}
          onNavigate={() => setAsideOpen(false)}
        />

        {asideOpen && (
          <button
            type="button"
            className="lesson-aside-backdrop"
            onClick={() => setAsideOpen(false)}
            aria-label="Закрыть"
          />
        )}

        <main
          className={`lesson-main${isExerciseFocus ? " lesson-main--fill" : ""}`}
        >
          <div
            className={`lesson-main-column${isExerciseFocus ? " lesson-main-column--fill" : ""}`}
          >
            <div
              className={`lesson-main-header${isExerciseFocus ? " lesson-main-header--compact" : ""}`}
            >
              {isExerciseFocus ? (
                <div className="lesson-main-header-row">
                  <button
                    type="button"
                    className="lesson-aside-toggle"
                    onClick={() => setAsideOpen((v) => !v)}
                  >
                    Уроки
                  </button>
                  <h1 className="lesson-title lesson-title--compact">
                    {current.lesson.title}
                  </h1>
                  <LessonStepper activeUnit={activeUnit} />
                </div>
              ) : (
                <>
                  <div className="lesson-main-header-top">
                    <Link
                      to="/"
                      className="lesson-nav-link lesson-nav-link--back"
                    >
                      ← Роадмап
                    </Link>
                    <button
                      type="button"
                      className="lesson-aside-toggle lesson-aside-toggle--theory"
                      onClick={() => setAsideOpen((v) => !v)}
                      aria-expanded={asideOpen}
                    >
                      Уроки
                    </button>
                  </div>
                  <div className="lesson-breadcrumb">
                    {mod.title} · {topic.title}
                  </div>
                  <h1 className="lesson-title">{current.lesson.title}</h1>
                  <LessonStepper activeUnit={activeUnit} />
                </>
              )}
            </div>

            <div
              className={`lesson-main-shell${isExerciseFocus ? " lesson-main-shell--fill" : ""}`}
            >
              <div
                className={`lesson-main-body${isExerciseFocus ? " lesson-main-body--fill" : ""}`}
              >
                <Outlet />
              </div>
            </div>

            {!isExerciseFocus && <LessonSideNav activeUnit={activeUnit} />}
          </div>
        </main>
      </div>
    </LessonContext.Provider>
  );
};
