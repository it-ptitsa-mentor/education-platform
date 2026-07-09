import { Link } from "react-router-dom";
import { isLessonComplete } from "../course";
import type { LessonUnit } from "../course";
import { lessonUnitPath, preferredLessonUnit } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";
import { LessonSideNav } from "./LessonSideNav";

type Props = {
  activeUnit: LessonUnit;
  onNavigate?: () => void;
};

export const LessonCourseSidebar = ({ activeUnit, onNavigate }: Props) => {
  const { module, topic, current, progressVersion } = useLesson();
  void progressVersion;

  return (
    <aside className="lesson-aside" aria-label="Уроки темы">
      <p className="lesson-aside-module">{module.title}</p>
      <p className="lesson-aside-topic-label">{topic.title}</p>
      <ul className="lesson-aside-lessons">
        {topic.lessons.map((lesson) => {
          const id = `${module.slug}/${topic.slug}/${lesson.index}`;
          const done = isLessonComplete(lesson, id);
          const isCurrent = id === current.id;
          const ref = { id, href: `/learn/${id}`, lesson, module, topic };
          const unit: LessonUnit = isCurrent
            ? preferredLessonUnit(lesson, activeUnit)
            : "theory";

          return (
            <li key={lesson.index}>
              <Link
                to={lessonUnitPath(ref, unit)}
                className={[
                  "lesson-aside-lesson",
                  isCurrent ? "is-active" : "",
                  done ? "is-done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onNavigate}
              >
                <span className="lesson-aside-lesson-num">
                  {String(lesson.index).padStart(2, "0")}
                </span>
                <span className="lesson-aside-lesson-title">{lesson.title}</span>
                {done && (
                  <span className="lesson-aside-lesson-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="lesson-aside-nav">
        <LessonSideNav activeUnit={activeUnit} onNavigate={onNavigate} />
      </div>
    </aside>
  );
};
