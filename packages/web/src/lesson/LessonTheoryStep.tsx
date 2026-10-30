import { useEffect, useMemo, useState } from "react";
import { loadTheory } from "../course";
import { extractH2Headings } from "../lib/theory-headings";
import { LessonTheoryContent } from "./LessonTheoryContent";
import { LessonTheoryToc } from "./LessonTheoryToc";
import { useLesson } from "./lesson-context";

export const LessonTheoryStep = () => {
  const { current } = useLesson();
  const [theory, setTheory] = useState<string | null>(null);

  useEffect(() => {
    setTheory(null);
    loadTheory(current.lesson.theory)
      .then(setTheory)
      .catch(() => setTheory("_Не удалось загрузить теорию._"));
  }, [current.lesson.theory]);

  const headings = useMemo(
    () => (theory ? extractH2Headings(theory) : []),
    [theory],
  );

  const hasToc = headings.length >= 2;

  return (
    <div className={hasToc ? "lesson-theory-with-toc" : undefined}>
      <LessonTheoryContent theory={theory} />
      {hasToc && <LessonTheoryToc headings={headings} />}
    </div>
  );
};
