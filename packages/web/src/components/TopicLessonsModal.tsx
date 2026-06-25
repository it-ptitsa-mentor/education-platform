import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { isLessonComplete, type Module, type Topic } from "../course";

type TopicLessonsModalProps = {
  module: Module;
  topic: Topic;
  activeLessonId?: string;
  onClose: () => void;
};

export const TopicLessonsModal = ({
  module,
  topic,
  activeLessonId,
  onClose,
}: TopicLessonsModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

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
        className="course-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="course-modal-head">
          <div>
            <p className="course-modal-kicker">{module.title}</p>
            <h2 id={titleId} className="course-modal-title">
              {topic.title}
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

        <ul className="course-modal-lessons">
          {topic.lessons.map((lesson) => {
            const id = `${module.slug}/${topic.slug}/${lesson.index}`;
            const done = isLessonComplete(lesson, id);
            const active = id === activeLessonId;
            return (
              <li key={lesson.index}>
                <Link
                  to={`/learn/${module.slug}/${topic.slug}/${lesson.index}/theory`}
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
                  <span className="course-modal-lesson-title">{lesson.title}</span>
                  <span className="course-modal-lesson-meta">
                    {lesson.quiz && <span>квиз</span>}
                    {lesson.exercise && <span>практика</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
