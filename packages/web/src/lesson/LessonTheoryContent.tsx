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
        <p className="lesson-theory-loading" aria-hidden>
          Загрузка теории…
        </p>
      ) : (
        <ReactMarkdown components={markdownComponents}>{theory}</ReactMarkdown>
      )}
    </article>
  );
};
