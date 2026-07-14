import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../lib/markdown-components";

type LessonTheoryContentProps = {
  /** Markdown-текст теории или null (загрузка ещё не завершена). */
  theory: string | null;
};

export const LessonTheoryContent = ({ theory }: LessonTheoryContentProps) => {
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
