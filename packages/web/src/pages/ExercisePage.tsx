import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { flattenLessons, loadCourse, type LessonRef } from "../course";
import { lessonFooterNext } from "../lib/lesson-units";

export const ExercisePage = () => {
  const { slug = "" } = useParams();
  const [allLessons, setAllLessons] = useState<LessonRef[]>([]);

  useEffect(() => {
    let alive = true;
    loadCourse()
      .then((course) => alive && setAllLessons(flattenLessons(course)))
      // Курс не загрузился — упражнение всё равно работает, просто без «Далее».
      .catch(() => alive && setAllLessons([]));
    return () => {
      alive = false;
    };
  }, []);

  // Урок, к которому привязано упражнение, и шаг после его практики.
  const continueLink = useMemo(() => {
    const current = allLessons.find((ref) => ref.lesson.exercise === slug);
    return current ? lessonFooterNext(current, allLessons, "exercise") : null;
  }, [allLessons, slug]);

  if (!slug) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Задача не указана.{" "}
        <Link to="/tasks" className="inline-link">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="exercise-page">
      <ExerciseRunner
        slug={slug}
        continueHref={continueLink?.to ?? null}
        continueLabel={continueLink?.title}
      />
    </div>
  );
};
