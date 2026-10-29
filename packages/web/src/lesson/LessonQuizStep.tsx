import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { markUnitDone } from "../course";
import { QuizRunner } from "../components/QuizRunner";
import { lessonFooterNext, lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

export const LessonQuizStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const { lesson } = current;
  const [passed, setPassed] = useState(false);

  // Роут переиспользует компонент между уроками — сбрасываем «пройдено» при смене урока.
  useEffect(() => {
    setPassed(false);
  }, [current.id]);

  if (!lesson.quiz) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  const continueLink = passed
    ? lessonFooterNext(current, allLessons, "quiz")
    : null;

  return (
    <div className="lesson-unit lesson-unit--quiz">
      {/* Над результатами: под ними идёт разбор всех вопросов, и кнопка ушла бы за экран. */}
      {continueLink && (
        <Link to={continueLink.to} className="btn btn-primary lesson-quiz-continue">
          Далее: {continueLink.title} →
        </Link>
      )}
      <QuizRunner
        slug={lesson.quiz}
        embedded
        onPassed={() => {
          markUnitDone(current.id, "quiz");
          refreshProgress();
          setPassed(true);
        }}
      />
    </div>
  );
};
