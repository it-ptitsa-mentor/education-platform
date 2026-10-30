import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import {
  activeUnitFromPath,
  lessonFooterNext,
  lessonFooterPrev,
  type LessonNavLink,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type NavCardProps = {
  direction: "prev" | "next";
  link: LessonNavLink;
};

const NavCard = ({ direction, link }: NavCardProps) => (
  <Link
    to={link.to}
    className={`lesson-end-nav-card lesson-end-nav-card--${direction}`}
  >
    <span className="lesson-end-nav-card-label">
      {direction === "prev" ? "← Предыдущий" : "Следующий →"}
    </span>
    <span className="lesson-end-nav-card-title">{link.title}</span>
    {link.hint && <span className="lesson-end-nav-card-hint">{link.hint}</span>}
  </Link>
);

export const LessonCourseSidebar = () => {
  const { module, topic, current, allLessons, progressVersion } = useLesson();
  void progressVersion;
  const { pathname } = useLocation();
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  // Шаг назад / вперёд по цепочке theory → quiz → exercise → следующий урок.
  const activeUnit = activeUnitFromPath(pathname);
  const prevLink = lessonFooterPrev(current, allLessons, activeUnit);
  const nextLink = lessonFooterNext(current, allLessons, activeUnit);

  return (
    <aside className="lesson-aside" aria-label="Уроки темы">
      <p className="lesson-aside-module">{module.title}</p>
      <p className="lesson-aside-topic-label">{topic.title}</p>
      <button
        type="button"
        className="lesson-aside-topic-nav-btn"
        onClick={() => setNavigatorOpen(true)}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">☰</span> Навигация по теме
      </button>

      {(prevLink || nextLink) && (
        <nav className="lesson-aside-step-nav" aria-label="Навигация по уроку">
          <div className="lesson-end-nav-cards">
            {prevLink && <NavCard direction="prev" link={prevLink} />}
            {nextLink && <NavCard direction="next" link={nextLink} />}
          </div>
        </nav>
      )}

      {navigatorOpen && (
        <TopicLessonsModal
          module={module}
          topic={topic}
          activeLessonId={current.id}
          onClose={() => setNavigatorOpen(false)}
        />
      )}
    </aside>
  );
};
