import { useState } from "react";
import { Navigate } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import { ExercisePassModal } from "../components/ExercisePassModal";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { lessonFooterNext, lessonFooterPrev, lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

export const LessonExerciseStep = () => {
  const { current, allLessons, refreshProgress, progressVersion } = useLesson();
  const { lesson } = current;
  void progressVersion;

  const continueLink = lessonFooterNext(current, allLessons, "exercise");
  const prevLink = lessonFooterPrev(current, allLessons, "exercise");
  const [showPassModal, setShowPassModal] = useState(
    () => isUnitDone(current.id, "exercise") && Boolean(continueLink),
  );

  if (!lesson.exercise) {
    return <Navigate to={lessonUnitPath(current, "theory")} replace />;
  }

  return (
    <div className="lesson-unit lesson-unit--exercise">
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
