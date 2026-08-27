import { useState } from "react";
import type { LessonUnit } from "../course";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import { useLesson } from "./lesson-context";
import { LessonSideNav } from "./LessonSideNav";

type Props = {
  activeUnit: LessonUnit;
  onNavigate?: () => void;
};

export const LessonCourseSidebar = ({ activeUnit, onNavigate }: Props) => {
  const { module, topic, current, progressVersion } = useLesson();
  void progressVersion;
  const [navigatorOpen, setNavigatorOpen] = useState(false);

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
      <div className="lesson-aside-nav">
        <LessonSideNav activeUnit={activeUnit} onNavigate={onNavigate} />
      </div>

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
