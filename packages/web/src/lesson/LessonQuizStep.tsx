import { Navigate } from "react-router-dom";
import { markUnitDone } from "../course";
import { QuizRunner } from "../components/QuizRunner";
import { lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";
import { LessonUnitNav } from "./LessonStepper";

export const LessonQuizStep = () => {
  const { current, refreshProgress } = useLesson();
  const { lesson, id } = current;

  if (!lesson.quiz) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  return (
    <div className="lesson-unit lesson-unit--quiz">
      <QuizRunner
        slug={lesson.quiz}
        embedded
        onPassed={() => {
          markUnitDone(id, "quiz");
          refreshProgress();
        }}
      />
      <LessonUnitNav unit="quiz" />
    </div>
  );
};
