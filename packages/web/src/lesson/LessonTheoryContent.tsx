import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { loadTheory } from "../course";
import { markdownComponents } from "../lib/markdown-components";

export const LessonTheoryContent = ({ theoryPath }: { theoryPath: string }) => {
  const [theory, setTheory] = useState("");

  useEffect(() => {
    setTheory("");
    loadTheory(theoryPath)
      .then(setTheory)
      .catch(() => setTheory("_Не удалось загрузить теорию._"));
  }, [theoryPath]);

  return (
    <article className="lesson-theory lesson-content prose">
      <ReactMarkdown components={markdownComponents}>{theory}</ReactMarkdown>
    </article>
  );
};
