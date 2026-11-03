import { Link, useLocation } from "react-router-dom";
import { TopicLessonsList } from "../components/TopicLessonsList";
import {
  activeUnitFromPath,
  lessonFooterNext,
  lessonFooterPrev,
  type LessonNavLink,
} from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

type StepLinkProps = {
  direction: "prev" | "next";
  link: LessonNavLink;
};

const StepLink = ({ direction, link }: StepLinkProps) => (
  <Link
    to={link.to}
    className="btn btn-secondary"
  >
    {direction === "prev" ? "← Назад" : "Далее →"}
  </Link>
);

export const LessonCourseSidebar = () => {
  const { module, topic, current, progressVersion } = useLesson();
  void progressVersion;

  return (
    <aside className="lesson-aside" aria-label="Уроки темы">
      <p className="lesson-aside-module">{module.title}</p>
      <p className="lesson-aside-topic-label">{topic.title}</p>
      <nav className="lesson-aside-lessons" aria-label="Список уроков темы">
        <TopicLessonsList module={module} topic={topic} activeLessonId={current.id} />
      </nav>

      <LessonStepNavigation />
    </aside>
  );
};

export const LessonStepNavigation = ({ mobile = false }: { mobile?: boolean }) => {
  const { current, allLessons } = useLesson();
  const { pathname } = useLocation();
  // Шаг назад / вперёд по цепочке theory → quiz → exercise → следующий урок.
  const activeUnit = activeUnitFromPath(pathname);
  const prevLink = lessonFooterPrev(current, allLessons, activeUnit);
  const nextLink = lessonFooterNext(current, allLessons, activeUnit);

  if (!prevLink && !nextLink) return null;
  return (
    <nav className={mobile ? "lesson-mobile-step-nav" : "lesson-aside-step-nav"} aria-label="Навигация по уроку">
      <div className="lesson-aside-step-links">
        {prevLink && <StepLink direction="prev" link={prevLink} />}
        {nextLink && <StepLink direction="next" link={nextLink} />}
      </div>
    </nav>
  );
};
