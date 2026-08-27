import { Link } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import type { LessonRef } from "../course";
import { lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type LessonEndNavCardProps = {
  direction: "prev" | "next";
  lesson: LessonRef;
};

const LessonEndNavCard = ({ direction, lesson }: LessonEndNavCardProps) => {
  const label = direction === "prev" ? "← Предыдущий" : "Следующий →";

  return (
    <Link
      to={lessonUnitPath(lesson, "theory")}
      className={`lesson-end-nav-card lesson-end-nav-card--${direction}`}
    >
      <span className="lesson-end-nav-card-label">{label}</span>
      <span className="lesson-end-nav-card-title">{lesson.lesson.title}</span>
    </Link>
  );
};

/** Блок в конце теории урока: отметка о прохождении + навигация по курсу. */
export const LessonEndNav = () => {
  const { current, prev, next, progressVersion, refreshProgress } =
    useLesson();

  const done = isUnitDone(current.id, "theory");
  void progressVersion;

  const handleMarkDone = () => {
    markUnitDone(current.id, "theory", !done);
    refreshProgress();
  };

  return (
    <section className="lesson-end-nav" aria-label="Завершение урока">
      <div className="lesson-end-nav-complete">
        <button
          type="button"
          className={`check-btn lesson-end-nav-complete-btn${done ? " is-done" : ""}`}
          onClick={handleMarkDone}
          aria-pressed={done}
        >
          {done ? "✓ Урок пройден" : "Отметить пройденным"}
        </button>
        <p className="lesson-end-nav-complete-hint">
          Дочитал — отметь, и урок встанет в прогресс курса.
        </p>
      </div>

      {(prev || next) && (
        <div className="lesson-end-nav-cards">
          {prev && <LessonEndNavCard direction="prev" lesson={prev} />}
          {next && <LessonEndNavCard direction="next" lesson={next} />}
        </div>
      )}
    </section>
  );
};
