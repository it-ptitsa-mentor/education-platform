import { markUnitDone } from "../course";
import {
  lessonTheoryContinueTarget,
} from "../lib/lesson-units";
import { LessonContinueButton } from "./LessonContinueButton";
import { useLesson } from "./lesson-context";
import { LessonTheoryContent } from "./LessonTheoryContent";

export const LessonTheoryStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const target = lessonTheoryContinueTarget(current, allLessons);

  return (
    <>
      <LessonTheoryContent theoryPath={current.lesson.theory} />
      {target ? (
        <LessonContinueButton
          target={target}
          onNavigate={() => {
            markUnitDone(current.id, "theory");
            refreshProgress();
          }}
        />
      ) : null}
    </>
  );
};
