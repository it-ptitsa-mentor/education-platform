import { Link } from "react-router-dom";
import type { LessonUnit } from "../course";
import { isUnitDone } from "../course";
import {
  lessonUnitPath,
  lessonUnits,
  unitLabel,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type LessonStepperProps = {
  activeUnit: LessonUnit;
};

export const LessonStepper = ({ activeUnit }: LessonStepperProps) => {
  const { current, progressVersion } = useLesson();
  const { lesson, id } = current;
  void progressVersion;

  return (
    <nav className="lesson-steps" aria-label="Шаги урока">
      {(["theory", "quiz", "exercise"] as const).map((unit) => {
        const available = lessonUnits(lesson).includes(unit);
        const done = isUnitDone(id, unit);
        const className = [
          "lesson-step",
          unit === activeUnit ? "is-active" : "",
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
            aria-current={unit === activeUnit ? "step" : undefined}
          >
            {unitLabel(unit)}
          </Link>
        );
      })}
    </nav>
  );
};
