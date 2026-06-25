import { Link } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import type { LessonUnit } from "../course";
import {
  lessonFooterNext,
  lessonFooterPrev,
  type LessonNavLink,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type LessonFooterNavProps = {
  activeUnit: LessonUnit;
};

const canAdvanceFromUnit = (lessonId: string, unit: LessonUnit) => {
  if (unit === "theory") return true;
  return isUnitDone(lessonId, unit);
};

const FooterNavSide = ({
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
  if (!link && !disabled) return <span className="lesson-footer-nav-spacer" />;

  const kicker = direction === "prev" ? "Назад" : "Далее";
  const sideClass =
    direction === "prev"
      ? "lesson-footer-nav-side--prev"
      : "lesson-footer-nav-side--next";

  if (disabled) {
    return (
      <div className={`lesson-footer-nav-side ${sideClass}`}>
        <div
          className="lesson-footer-nav-card lesson-footer-nav-card--disabled"
          aria-disabled
        >
          <span className="lesson-footer-nav-kicker">{kicker}</span>
          <span className="lesson-footer-nav-title">{disabledHint}</span>
        </div>
      </div>
    );
  }

  if (!link) return <span className="lesson-footer-nav-spacer" />;

  return (
    <div className={`lesson-footer-nav-side ${sideClass}`}>
      <Link
        to={link.to}
        className={`lesson-footer-nav-card lesson-footer-nav-card--${direction}`}
        onClick={onNavigate}
      >
        <span className="lesson-footer-nav-kicker">{kicker}</span>
        <span className="lesson-footer-nav-title">
          {direction === "prev" ? `← ${link.title}` : `${link.title} →`}
        </span>
        {link.hint ? (
          <span className="lesson-footer-nav-hint">{link.hint}</span>
        ) : null}
      </Link>
    </div>
  );
};

export const LessonFooterNav = ({ activeUnit }: LessonFooterNavProps) => {
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
    <footer className="lesson-footer-nav" aria-label="Навигация по уроку">
      <FooterNavSide direction="prev" link={prev} />
      <FooterNavSide
        direction="next"
        link={canAdvance ? next : null}
        disabled={Boolean(next && !canAdvance)}
        disabledHint={disabledHint}
        onNavigate={handleNextNavigate}
      />
    </footer>
  );
};
