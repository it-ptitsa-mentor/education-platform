import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { isUnitDone, type Module, type Topic } from "../course";

type TopicLessonsModalProps = {
  module: Module;
  topic: Topic;
  activeLessonId?: string;
  onClose: () => void;
};

export const TopicLessonsModal = ({
  module: mod,
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
    document.documentElement.classList.add("modal-open");
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="course-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="course-modal-panel topic-lessons-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="course-modal-head">
          <div>
            <p className="course-modal-kicker">{mod.title}</p>
            <h2 id={titleId} className="course-modal-title">{topic.title}</h2>
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

        <div className="topic-lessons-table-wrap">
          <table className="topic-lessons-table">
            <thead>
              <tr>
                <th className="topic-lessons-th topic-lessons-th--num">#</th>
                <th className="topic-lessons-th">Название</th>
                <th className="topic-lessons-th topic-lessons-th--unit">Тест</th>
                <th className="topic-lessons-th topic-lessons-th--unit">Практика</th>
              </tr>
            </thead>
            <tbody>
              {topic.lessons.map((lesson) => {
                const id = `${mod.slug}/${topic.slug}/${lesson.index}`;
                const isActive = id === activeLessonId;
                const quizDone = lesson.quiz != null ? isUnitDone(id, "quiz") : null;
                const exDone = lesson.exercise != null ? isUnitDone(id, "exercise") : null;

                return (
                  <tr
                    key={lesson.index}
                    className={`topic-lessons-row${isActive ? " is-active" : ""}`}
                  >
                    <td className="topic-lessons-td topic-lessons-td--num">
                      {lesson.index}
                    </td>
                    <td className="topic-lessons-td">
                      <Link
                        to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/theory`}
                        className="topic-lessons-link"
                        onClick={onClose}
                      >
                        {lesson.title}
                      </Link>
                    </td>
                    <td className="topic-lessons-td topic-lessons-td--unit">
                      {quizDone !== null && (
                        <span
                          className={`topic-lessons-dot${quizDone ? " is-done" : ""}`}
                          title={quizDone ? "пройдено" : "есть тест"}
                        />
                      )}
                    </td>
                    <td className="topic-lessons-td topic-lessons-td--unit">
                      {exDone !== null && (
                        <span
                          className={`topic-lessons-dot${exDone ? " is-done" : ""}`}
                          title={exDone ? "пройдено" : "есть практика"}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
