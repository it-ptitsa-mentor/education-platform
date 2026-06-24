import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadCourse, readProgress, type Course } from "../course";

export const CourseHomePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progress = readProgress();

  useEffect(() => {
    loadCourse()
      .then(setCourse)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error)
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  if (!course)
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА КУРСА</span>
      </div>
    );

  const allLessons = course.modules.flatMap((m) =>
    m.topics.flatMap((t) => t.lessons),
  );
  const done = Object.values(progress).filter(Boolean).length;

  return (
    <div className="home course-home">
      <div className="home-hero">
        <p className="home-kicker">Образовательная программа</p>
        <h2 className="home-title">{course.course}</h2>
        <p className="home-lead">
          Теория, квиз и практика в каждом уроке. Идите по порядку — от основ до
          оффера.
        </p>
        <div className="course-meta">
          <span>
            <b>{course.modules.length}</b> модулей
          </span>
          <span>
            <b>{allLessons.length}</b> уроков
          </span>
          <span>
            <b>{done}</b> пройдено
          </span>
        </div>
      </div>

      <div className="course-modules">
        {course.modules.map((m) => (
          <section key={m.slug} className="course-module">
            <header className="course-module-head">
              <span className="course-module-num">
                {String(m.index).padStart(2, "0")}
              </span>
              <h3>{m.title}</h3>
              <span className="course-module-count">
                {m.topics.length} тем ·{" "}
                {m.topics.reduce((s, t) => s + t.lessons.length, 0)} уроков
              </span>
            </header>

            <div className="course-topics">
              {m.topics.map((t) => (
                <div key={t.slug} className="course-topic">
                  <div className="course-topic-title">{t.title}</div>
                  <ul className="course-lessons">
                    {t.lessons.map((l) => {
                      const id = `${m.slug}/${t.slug}/${l.index}`;
                      const isDone = progress[id];
                      return (
                        <li key={l.index}>
                          <Link to={`/learn/${id}`} className="course-lesson">
                            <span
                              className={`course-lesson-dot${isDone ? " is-done" : ""}`}
                              aria-hidden
                            >
                              {isDone ? "✓" : ""}
                            </span>
                            <span className="course-lesson-title">
                              {l.title}
                            </span>
                            <span className="course-lesson-badges">
                              {l.quiz && <span title="есть квиз">❓</span>}
                              {l.exercise && (
                                <span title="есть практика">💻</span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
