import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadTheory } from "../course";
import { markdownComponents } from "../lib/markdown-components";

export const LessonTheoryContent = ({ theoryPath }: { theoryPath: string }) => {
  const [theory, setTheory] = useState<string | null>(null);

  useEffect(() => {
    setTheory(null);
    loadTheory(theoryPath)
      .then(setTheory)
      .catch(() => setTheory("_Не удалось загрузить теорию._"));
  }, [theoryPath]);

  const loading = theory === null;

  return (
    <article
      className={`lesson-theory lesson-content prose${loading ? " lesson-theory--loading" : ""}`}
      aria-busy={loading}
    >
      {loading ? (
        <div className="lesson-theory-spinner">
          <span className="spinner spinner-lg" aria-hidden />
        </div>
      ) : (
        <ReactMarkdown components={markdownComponents}>{theory}</ReactMarkdown>
      )}
    </article>
  );
};
