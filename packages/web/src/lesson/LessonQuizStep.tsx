import { useState } from "react";
import { Navigate } from "react-router-dom";
import { markUnitDone } from "../course";
import { QuizRunner } from "../components/QuizRunner";
import {
  lessonQuizContinueTarget,
  lessonUnitPath,
} from "../lib/lesson-units";
import { LessonContinueButton } from "./LessonContinueButton";
import { useLesson } from "./lesson-context";

export const LessonQuizStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const { lesson } = current;
  const [passed, setPassed] = useState(false);

  if (!lesson.quiz) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  const target = lessonQuizContinueTarget(current, allLessons);

  return (
    <>
      <div className="lesson-unit lesson-unit--quiz">
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
      {passed && target ? <LessonContinueButton target={target} /> : null}
    </>
  );
};
