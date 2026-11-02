import { Link } from "react-router-dom";
import { isUnitDone, type Module, type Topic } from "../course";

export const TopicLessonsList = ({ module: mod, topic, activeLessonId, onNavigate }: { module: Module; topic: Topic; activeLessonId?: string; onNavigate?: () => void }) => {
  return (
    <ul className="topic-lessons-list">
      {topic.lessons.map((lesson) => {
        const id = `${mod.slug}/${topic.slug}/${lesson.index}`;
        const isActive = id === activeLessonId;
        const quizDone = lesson.quiz != null ? isUnitDone(id, "quiz") : null;
        const exDone = lesson.exercise != null ? isUnitDone(id, "exercise") : null;
        return (
          <li key={lesson.index} className={`topic-lessons-item${isActive ? " is-active" : ""}`}>
            <div className="topic-lessons-row">
              <Link
                to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/theory`}
                className="topic-lessons-link"
                title={lesson.title}
                onClick={onNavigate}
              >
                {lesson.title}
              </Link>
              {(quizDone !== null || exDone !== null) && (
                <div className="topic-lessons-indicators">
                  {quizDone !== null && (
                    <Link
                      to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/quiz`}
                      className={`tl-dot${quizDone ? " tl-dot--done" : ""}`}
                      onClick={onNavigate}
                      title={quizDone ? "Тест пройден" : "Открыть тест"}
                      aria-label={`${lesson.title}: ${quizDone ? "тест пройден" : "открыть тест"}`}
                    />
                  )}
                  {exDone !== null && (
                    <Link
                      to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/exercise`}
                      className={`tl-dot${exDone ? " tl-dot--done" : ""}`}
                      onClick={onNavigate}
                      title={exDone ? "Практика пройдена" : "Открыть практику"}
                      aria-label={`${lesson.title}: ${exDone ? "практика пройдена" : "открыть практику"}`}
                    />
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
