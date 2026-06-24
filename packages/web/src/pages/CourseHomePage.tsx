import { useEffect, useMemo, useState } from "react";
import { loadCourse, isLessonComplete, type Course, type Module, type Topic } from "../course";
import { TopicLessonsModal } from "../components/TopicLessonsModal";

type OpenTopic = {
  module: Module;
  topic: Topic;
};

export const CourseHomePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [openTopic, setOpenTopic] = useState<OpenTopic | null>(null);

  useEffect(() => {
    loadCourse()
      .then(setCourse)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    const bump = () => setProgressVersion((v) => v + 1);
    window.addEventListener("ptitsa-course-progress", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("ptitsa-course-progress", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);

  const lessonIndex = useMemo(() => {
    const map = new Map<string, Course["modules"][0]["topics"][0]["lessons"][0]>();
    if (!course) return map;
    for (const m of course.modules)
      for (const t of m.topics)
        for (const l of t.lessons) map.set(`${m.slug}/${t.slug}/${l.index}`, l);
    return map;
  }, [course]);

  const allLessonIds = useMemo(
    () => [...lessonIndex.keys()],
    [lessonIndex],
  );

  const done = useMemo(() => {
    void progressVersion;
    return allLessonIds.filter((id) => {
      const lesson = lessonIndex.get(id);
      return lesson ? isLessonComplete(lesson, id) : false;
    }).length;
  }, [allLessonIds, lessonIndex, progressVersion]);

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

  const topicDoneCount = (moduleSlug: string, topic: Topic) => {
    void progressVersion;
    return topic.lessons.filter((l) =>
      isLessonComplete(l, `${moduleSlug}/${topic.slug}/${l.index}`),
    ).length;
  };

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

            <ul className="course-topic-list">
              {m.topics.map((t) => {
                const doneInTopic = topicDoneCount(m.slug, t);
                const total = t.lessons.length;
                return (
                  <li key={t.slug}>
                    <button
                      type="button"
                      className="course-topic-btn"
                      onClick={() => setOpenTopic({ module: m, topic: t })}
                    >
                      <span className="course-topic-btn-title">{t.title}</span>
                      <span className="course-topic-btn-meta">
                        {total} уроков
                        {doneInTopic > 0 && (
                          <span className="course-topic-btn-progress">
                            · {doneInTopic}/{total}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {openTopic && (
        <TopicLessonsModal
          module={openTopic.module}
          topic={openTopic.topic}
          onClose={() => setOpenTopic(null)}
        />
      )}
    </div>
  );
};
