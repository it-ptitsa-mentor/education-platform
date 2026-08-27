import { useState } from "react";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import { useLesson } from "./lesson-context";

export const LessonCourseSidebar = () => {
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
