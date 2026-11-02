import { Link } from "react-router-dom";
import { type Module, type Topic } from "../course";

export const TopicLessonsList = ({ module: mod, topic, activeLessonId, onNavigate }: { module: Module; topic: Topic; activeLessonId?: string; onNavigate?: () => void }) => {
  return (
    <ul className="topic-lessons-list">
      {topic.lessons.map((lesson) => {
        const id = `${mod.slug}/${topic.slug}/${lesson.index}`;
        const isActive = id === activeLessonId;
        return (
          <li key={lesson.index} className={`topic-lessons-item${isActive ? " is-active" : ""}`}>
            <Link
              to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/theory`}
              className="topic-lessons-link"
              title={lesson.title}
              onClick={onNavigate}
            >
              {lesson.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
