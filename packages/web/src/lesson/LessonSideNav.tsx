import { Link } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import type { LessonUnit } from "../course";
import {
  lessonFooterNext,
  lessonFooterPrev,
  type LessonNavLink,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type LessonSideNavProps = {
  activeUnit: LessonUnit;
};

const canAdvanceFromUnit = (lessonId: string, unit: LessonUnit) => {
  if (unit === "theory") return true;
  return isUnitDone(lessonId, unit);
};

const SideNavLink = ({
  direction,
  link,
  disabled,
  disabledHint,
  onNavigate,
}: {
  direction: "prev" | "next";
  link: LessonNavLink | null;
  disabled?: boolean;
  disabledHint?: string;
  onNavigate?: () => void;
}) => {
  if (!link && !disabled) return null;

  const label = direction === "prev" ? "Назад" : "Далее";
  const arrow = direction === "prev" ? "←" : "→";

  if (disabled) {
    return (
      <div
        className="lesson-side-nav-block lesson-side-nav-block--disabled"
        aria-disabled
      >
        <span className="lesson-side-nav-label">{label}</span>
        <span className="lesson-side-nav-title">{disabledHint}</span>
      </div>
    );
  }

  if (!link) return null;

  return (
    <Link
      to={link.to}
      className={`lesson-side-nav-link lesson-side-nav-link--${direction}`}
      onClick={onNavigate}
    >
      <span className="lesson-side-nav-arrow" aria-hidden>
        {arrow}
      </span>
      <span className="lesson-side-nav-label">{label}</span>
      <span className="lesson-side-nav-title">{link.title}</span>
      {link.hint ? (
        <span className="lesson-side-nav-hint">{link.hint}</span>
      ) : null}
    </Link>
  );
};

export const LessonSideNav = ({ activeUnit }: LessonSideNavProps) => {
  const { current, allLessons, progressVersion, refreshProgress } = useLesson();
  void progressVersion;

  const prev = lessonFooterPrev(current, allLessons, activeUnit);
  const next = lessonFooterNext(current, allLessons, activeUnit);
  const canAdvance = canAdvanceFromUnit(current.id, activeUnit);

  const handleNextNavigate = () => {
    if (activeUnit === "theory") {
      markUnitDone(current.id, "theory");
      refreshProgress();
    }
  };

  const disabledHint =
    activeUnit === "quiz"
      ? "Пройдите квиз, чтобы продолжить"
      : "Выполните задачу, чтобы продолжить";

  if (!prev && !next) return null;

  return (
    <aside className="lesson-side-nav" aria-label="Навигация по уроку">
      <SideNavLink direction="prev" link={prev} />
      <SideNavLink
        direction="next"
        link={canAdvance ? next : null}
        disabled={Boolean(next && !canAdvance)}
        disabledHint={disabledHint}
        onNavigate={handleNextNavigate}
      />
    </aside>
  );
};
