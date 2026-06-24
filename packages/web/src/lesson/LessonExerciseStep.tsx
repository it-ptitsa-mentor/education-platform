import { useState } from "react";
import { Navigate } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import { ExerciseRunner } from "../components/ExerciseRunner";
import {
  lessonExerciseContinueTarget,
  lessonUnitPath,
} from "../lib/lesson-units";
import { LessonContinueButton } from "./LessonContinueButton";
import { useLesson } from "./lesson-context";

export const LessonExerciseStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const { lesson } = current;
  const [passed, setPassed] = useState(false);

  if (!lesson.exercise) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  if (lesson.quiz && !isUnitDone(current.id, "quiz")) {
    return <Navigate to={lessonUnitPath(current, "quiz")} replace />;
  }

  const target = lessonExerciseContinueTarget(current, allLessons);

  return (
    <>
      <div className="lesson-unit lesson-unit--exercise">
        <ExerciseRunner
          slug={lesson.exercise}
          embedded
          onPassed={() => {
            markUnitDone(current.id, "exercise");
            refreshProgress();
            setPassed(true);
          }}
        />
      </div>
      {passed && target ? <LessonContinueButton target={target} /> : null}
    </>
  );
};
