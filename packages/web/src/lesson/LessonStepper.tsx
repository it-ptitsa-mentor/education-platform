import { Link, useLocation } from "react-router-dom";
import type { LessonUnit } from "../course";
import { isUnitDone, type Lesson } from "../course";
import {
  lessonUnitPath,
  lessonUnits,
  nextUnit,
  prevUnit,
  unitLabel,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

export const LessonStepper = () => {
  const { current, progressVersion } = useLesson();
  const location = useLocation();
  const { lesson, id } = current;
  void progressVersion;

  const activeUnit = (): LessonUnit => {
    if (location.pathname.endsWith("/quiz")) return "quiz";
    if (location.pathname.endsWith("/exercise")) return "exercise";
    return "theory";
  };
  const active = activeUnit();

  return (
    <nav className="lesson-steps" aria-label="Шаги урока">
      {(["theory", "quiz", "exercise"] as const).map((unit) => {
        const available = lessonUnits(lesson).includes(unit);
        const done = isUnitDone(id, unit);
        const className = [
          "lesson-step",
          unit === active ? "is-active" : "",
          !available ? "is-off" : "",
          done ? "is-done" : "",
        ]
          .filter(Boolean)
          .join(" ");

        if (!available) {
          return (
            <span key={unit} className={className} aria-disabled>
              {unitLabel(unit)}
            </span>
          );
        }

        return (
          <Link
            key={unit}
            to={lessonUnitPath(current, unit)}
            className={className}
            aria-current={unit === active ? "step" : undefined}
          >
            {unitLabel(unit)}
          </Link>
        );
      })}
    </nav>
  );
};

const lastUnit = (lesson: Lesson): LessonUnit =>
  lessonUnits(lesson).at(-1) ?? "theory";

type LessonUnitNavProps = {
  unit: LessonUnit;
  onContinue?: () => void;
  continueLabel?: string;
  /** Inline back link only — for compact exercise header */
  compact?: boolean;
};

export const LessonUnitNav = ({
  unit,
  onContinue,
  continueLabel,
  compact = false,
}: LessonUnitNavProps) => {
  const { current, prev, next } = useLesson();
  const { lesson } = current;

  const prevU = prevUnit(lesson, unit);
  const nextU = nextUnit(lesson, unit);

  const prevHref = prevU
    ? lessonUnitPath(current, prevU)
    : prev
      ? lessonUnitPath(prev, lastUnit(prev.lesson))
      : null;

  const backLabel = prevU
    ? `← ${unitLabel(prevU)}`
    : prev
      ? "← Предыдущий урок"
      : null;

  const defaultContinue =
    nextU === "quiz"
      ? "К квизу →"
      : nextU === "exercise"
        ? "К практике →"
        : next
          ? `${next.lesson.title} →`
          : "Готово";

  if (compact) {
    if (!prevHref || !backLabel) return null;
    return (
      <Link
        to={prevHref}
        className="lesson-nav-link lesson-nav-link--back lesson-nav-link--inline"
      >
        {backLabel}
      </Link>
    );
  }

  return (
    <div className="lesson-actions">
      {onContinue ? (
        <button
          type="button"
          className="lesson-cta lesson-cta--practice"
          onClick={onContinue}
        >
          {continueLabel ?? defaultContinue}
        </button>
      ) : null}

      {prevHref && backLabel ? (
        <nav className="lesson-nav lesson-nav--units" aria-label="Назад">
          <Link to={prevHref} className="lesson-nav-link lesson-nav-link--back">
            {backLabel}
          </Link>
        </nav>
      ) : null}
    </div>
  );
};
