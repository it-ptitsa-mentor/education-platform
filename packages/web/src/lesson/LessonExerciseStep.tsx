import { useState } from "react";
import { Navigate } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import { ExercisePassModal } from "../components/ExercisePassModal";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { lessonFooterNext, lessonFooterPrev, lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

export const LessonExerciseStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const { lesson } = current;

  const continueLink = lessonFooterNext(current, allLessons, "exercise");
  const prevLink = lessonFooterPrev(current, allLessons, "exercise");
  const alreadyDone = isUnitDone(current.id, "exercise");
  const [showPassModal, setShowPassModal] = useState(false);

  if (!lesson.exercise) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  return (
    <div className="lesson-unit lesson-unit--exercise">
      {alreadyDone && (
        <div className="exercise-done-banner" role="status">
          <span className="exercise-done-banner__icon" aria-hidden>✓</span>
          Задание уже выполнено — можно решить заново
        </div>
      )}
      <ExerciseRunner
        slug={lesson.exercise}
        embedded
        mobilePrevHref={prevLink?.to ?? null}
        mobileNextHref={continueLink?.to ?? null}
        onPassed={() => {
          markUnitDone(current.id, "exercise");
          refreshProgress();
          if (continueLink) {
            setShowPassModal(true);
          }
        }}
      />
      {showPassModal && continueLink ? (
        <ExercisePassModal
          continueLink={continueLink}
          onClose={() => setShowPassModal(false)}
        />
      ) : null}
    </div>
  );
};
