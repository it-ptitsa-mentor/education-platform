import { Link } from "react-router-dom";
import { markUnitDone } from "../course";
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
        className="lesson-footer-nav-block lesson-footer-nav-block--disabled"
        aria-disabled
      >
        <span className="lesson-footer-nav-label">{label}</span>
        <span className="lesson-footer-nav-title">{disabledHint}</span>
      </div>
    );
  }

  if (!link) return null;

  return (
    <Link
      to={link.to}
      className={`lesson-footer-nav-link lesson-footer-nav-link--${direction}`}
      onClick={onNavigate}
    >
      <span className="lesson-footer-nav-arrow" aria-hidden>
        {arrow}
      </span>
      <span className="lesson-footer-nav-label">{label}</span>
      <span className="lesson-footer-nav-title">{link.title}</span>
      {link.hint ? (
        <span className="lesson-footer-nav-hint">{link.hint}</span>
      ) : null}
    </Link>
  );
};

export const LessonSideNav = ({ activeUnit }: LessonSideNavProps) => {
  const { current, allLessons, progressVersion, refreshProgress } = useLesson();
  void progressVersion;

  const prev = lessonFooterPrev(current, allLessons, activeUnit);
  const next = lessonFooterNext(current, allLessons, activeUnit);
  const handleNextNavigate = () => {
    if (activeUnit === "theory") {
      markUnitDone(current.id, "theory");
      refreshProgress();
    }
  };

  if (!prev && !next) return null;

  return (
    <nav className="lesson-footer-nav" aria-label="Навигация по уроку">
      <SideNavLink direction="prev" link={prev} />
      <SideNavLink
        direction="next"
        link={next}
        onNavigate={handleNextNavigate}
      />
    </nav>
  );
};
