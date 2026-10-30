import { Navigate } from "react-router-dom";
import { isUnitDone, markUnitDone } from "../course";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { lessonFooterNext, lessonFooterPrev, lessonUnitPath } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";

export const LessonExerciseStep = () => {
  const { current, allLessons, refreshProgress } = useLesson();
  const { lesson } = current;

  const continueLink = lessonFooterNext(current, allLessons, "exercise");
  const prevLink = lessonFooterPrev(current, allLessons, "exercise");
  const alreadyDone = isUnitDone(current.id, "exercise");

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
      {/* «Далее» — как на standalone /exercise/:slug: видна всегда, серая до
          PASS и золотая после. Модалки после PASS нет. */}
      <ExerciseRunner
        slug={lesson.exercise}
        embedded
        mobilePrevHref={prevLink?.to ?? null}
        mobileNextHref={continueLink?.to ?? null}
        continueHref={continueLink?.to ?? null}
        continueLabel={continueLink?.title}
        onPassed={() => {
          markUnitDone(current.id, "exercise");
          refreshProgress();
        }}
      />
    </div>
  );
};
