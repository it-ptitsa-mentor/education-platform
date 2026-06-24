import { Navigate } from "react-router-dom";
import { markUnitDone } from "../course";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";
export const LessonExerciseStep = () => {
  const { current, refreshProgress } = useLesson();
  const { lesson, id } = current;

  if (!lesson.exercise) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  return (
    <div className="lesson-unit lesson-unit--exercise">
      <ExerciseRunner
        slug={lesson.exercise}
        embedded
        onPassed={() => {
          markUnitDone(id, "exercise");
          refreshProgress();
        }}
      />
    </div>
  );
};
