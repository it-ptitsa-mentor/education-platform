import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { loadTheory, markUnitDone } from "../course";
import { markdownComponents } from "../lib/markdown-components";
import { lessonUnitPath, nextUnit } from "../lib/lesson-units";
import { useLesson } from "./lesson-context";
import { LessonUnitNav } from "./LessonStepper";

export const LessonTheoryStep = () => {
  const { current, next, refreshProgress } = useLesson();
  const navigate = useNavigate();
  const [theory, setTheory] = useState("");
  const { lesson, id } = current;

  useEffect(() => {
    setTheory("");
    loadTheory(lesson.theory)
      .then(setTheory)
      .catch(() => setTheory("_Не удалось загрузить теорию._"));
  }, [lesson.theory]);

  const handleContinue = () => {
    markUnitDone(id, "theory");
    refreshProgress();

    const nextStep = nextUnit(lesson, "theory");
    if (nextStep) {
      navigate(lessonUnitPath(current, nextStep));
      return;
    }
    if (next) navigate(lessonUnitPath(next, "theory"));
  };

  return (
    <>
      <article className="lesson-theory lesson-content prose">
        <ReactMarkdown components={markdownComponents}>{theory}</ReactMarkdown>
      </article>

      <LessonUnitNav
        unit="theory"
        onContinue={handleContinue}
        continueLabel={
          nextUnit(lesson, "theory") === "quiz"
            ? "К квизу →"
            : nextUnit(lesson, "theory") === "exercise"
              ? "К практике →"
              : next
                ? `${next.lesson.title} →`
                : "Завершить урок"
        }
      />
    </>
  );
};
