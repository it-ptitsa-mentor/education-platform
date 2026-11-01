import { Link, useNavigate } from "react-router-dom";
import { isUnitDone, type Module, type Topic } from "../course";

export const TopicLessonsList = ({ module: mod, topic, activeLessonId, onNavigate }: { module: Module; topic: Topic; activeLessonId?: string; onNavigate?: () => void }) => {
 const navigate = useNavigate();
 return (
        <div className="topic-lessons-table-wrap">
          <table className="topic-lessons-table">
            <thead>
              <tr>
                <th className="topic-lessons-th topic-lessons-th--num">#</th>
                <th className="topic-lessons-th">Название</th>
                <th className="topic-lessons-th topic-lessons-th--unit">Тест</th>
                <th className="topic-lessons-th topic-lessons-th--unit">Практика</th>
              </tr>
            </thead>
            <tbody>
              {topic.lessons.map((lesson) => {
                const id = `${mod.slug}/${topic.slug}/${lesson.index}`;
                const isActive = id === activeLessonId;
                const quizDone = lesson.quiz != null ? isUnitDone(id, "quiz") : null;
                const exDone = lesson.exercise != null ? isUnitDone(id, "exercise") : null;

                return (
                  <tr
                    key={lesson.index}
                    className={`topic-lessons-row${isActive ? " is-active" : ""}`}
                    onClick={(event) => {
                      // Клик по ссылке внутри строки (название, точки «Тест»/«Практика»)
                      // уже обработан самой ссылкой — не перебиваем её переходом на теорию.
                      if ((event.target as HTMLElement).closest("a")) return;
                      navigate(`/learn/${mod.slug}/${topic.slug}/${lesson.index}/theory`);
                      onNavigate?.();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="topic-lessons-td topic-lessons-td--num">
                      {lesson.index}
                    </td>
                    <td className="topic-lessons-td">
                      <Link
                        to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/theory`}
                        className="topic-lessons-link"
                        onClick={onNavigate}
                      >
                        {lesson.title}
                      </Link>
                    </td>
                    <td className="topic-lessons-td topic-lessons-td--unit">
                      {quizDone !== null && (
                        <Link
                          to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/quiz`}
                          className="topic-lessons-dot-link"
                          onClick={onNavigate}
                          title={quizDone ? "Тест пройден — открыть" : "Открыть тест"}
                          aria-label={`${lesson.title}: ${quizDone ? "тест пройден — открыть" : "открыть тест"}`}
                        >
                          <span
                            className={`topic-lessons-dot${quizDone ? " is-done" : ""}`}
                            aria-hidden
                          />
                        </Link>
                      )}
                    </td>
                    <td className="topic-lessons-td topic-lessons-td--unit">
                      {exDone !== null && (
                        <Link
                          to={`/learn/${mod.slug}/${topic.slug}/${lesson.index}/exercise`}
                          className="topic-lessons-dot-link"
                          onClick={onNavigate}
                          title={exDone ? "Практика пройдена — открыть" : "Открыть практику"}
                          aria-label={`${lesson.title}: ${exDone ? "практика пройдена — открыть" : "открыть практику"}`}
                        >
                          <span
                            className={`topic-lessons-dot${exDone ? " is-done" : ""}`}
                            aria-hidden
                          />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
 );
};
