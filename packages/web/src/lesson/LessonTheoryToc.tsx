import type { HeadingItem } from "../lib/theory-headings";

type LessonTheoryTocProps = {
  headings: HeadingItem[];
};

/**
 * Оглавление теории: список H2-якорей справа от колонки теории.
 * Рендерится только если заголовков >= 2.
 */
export const LessonTheoryToc = ({ headings }: LessonTheoryTocProps) => {
  if (headings.length < 2) return null;

  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="lesson-theory-toc" aria-label="Содержание урока">
      <p className="lesson-theory-toc-title">Содержание</p>
      <ul className="lesson-theory-toc-list">
        {headings.map(({ id, text }) => (
          <li key={id} className="lesson-theory-toc-item">
            <a
              href={`#${id}`}
              className="lesson-theory-toc-link"
              onClick={handleClick(id)}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
