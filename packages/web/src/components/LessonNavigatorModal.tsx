import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isLessonComplete, type Course, type LessonUnit } from "../course";
import { lessonUnitPath, preferredLessonUnit } from "../lib/lesson-units";

type LessonNavigatorModalProps = {
  course: Course;
  currentLessonId: string;
  activeUnit: LessonUnit;
  onClose: () => void;
};

const topicKey = (moduleSlug: string, topicSlug: string) =>
  `${moduleSlug}/${topicSlug}`;

export const LessonNavigatorModal = ({
  course,
  currentLessonId,
  activeUnit,
  onClose,
}: LessonNavigatorModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(() => {
    const [moduleSlug, topicSlug] = currentLessonId.split("/");
    return moduleSlug && topicSlug ? topicKey(moduleSlug, topicSlug) : null;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="course-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="course-modal-panel course-modal-panel--navigator"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="course-modal-head">
          <div>
            <p className="course-modal-kicker">Курс</p>
            <h2 id={titleId} className="course-modal-title">
              {course.course}
            </h2>
          </div>
          <button
            type="button"
            className="course-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className="course-navigator-body">
          {course.modules.map((mod) => (
            <section key={mod.slug} className="course-navigator-module">
              <h3 className="course-navigator-module-title">
                <span className="course-navigator-module-num">
                  {String(mod.index).padStart(2, "0")}
                </span>
                {mod.title}
              </h3>

              <ul className="course-navigator-topics">
                {mod.topics.map((topic) => {
                  const key = topicKey(mod.slug, topic.slug);
                  const expanded = expandedKey === key;
                  const isCurrentTopic = currentLessonId.startsWith(`${key}/`);

                  return (
                    <li key={topic.slug} className="course-navigator-topic">
                      <button
                        type="button"
                        className={[
                          "course-navigator-topic-btn",
                          isCurrentTopic ? "is-current" : "",
                          expanded ? "is-expanded" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedKey(expanded ? null : key)
                        }
                      >
                        <span className="course-navigator-topic-title">
                          {topic.title}
                        </span>
                        <span className="course-navigator-topic-meta">
                          {topic.lessons.length} урок.
                        </span>
                      </button>

                      {expanded ? (
                        <ul className="course-modal-lessons course-modal-lessons--nested">
                          {topic.lessons.map((lesson) => {
                            const id = `${mod.slug}/${topic.slug}/${lesson.index}`;
                            const done = isLessonComplete(lesson, id);
                            const active = id === currentLessonId;
                            const unit =
                              id === currentLessonId
                                ? preferredLessonUnit(lesson, activeUnit)
                                : "theory";
                            const ref = {
                              id,
                              href: `/learn/${id}`,
                              lesson,
                              module: mod,
                              topic,
                            };

                            return (
                              <li key={lesson.index}>
                                <Link
                                  to={lessonUnitPath(ref, unit)}
                                  className={[
                                    "course-modal-lesson",
                                    done ? "is-done" : "",
                                    active ? "is-active" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                  onClick={onClose}
                                >
                                  <span className="course-modal-lesson-num">
                                    {String(lesson.index).padStart(2, "0")}
                                  </span>
                                  <span className="course-modal-lesson-title">
                                    {lesson.title}
                                  </span>
                                  <span className="course-modal-lesson-meta">
                                    {lesson.quiz ? <span>квиз</span> : null}
                                    {lesson.exercise ? (
                                      <span>практика</span>
                                    ) : null}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
