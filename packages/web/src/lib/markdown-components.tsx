import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { headingToId } from "./theory-headings";

const isHexletHref = (href?: string) =>
  Boolean(href && /hexlet\.io/i.test(href));

/**
 * Резолвит относительный src картинки из readme (например, "assets/final.png")
 * от корня приложения (с учётом BASE_URL), а не от текущего вложенного роута
 * (/exercise/:slug), где он иначе 404-ится. Абсолютные и протокольные URL не трогаем.
 */
const resolveReadmeImageSrc = (src?: string): string | undefined => {
  if (!src) return src;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(src) || src.startsWith("data:")) {
    return src;
  }
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const relative = src.replace(/^\.?\//, "");
  return `${normalizedBase}${relative}`;
};

/** Рекурсивно извлечь текст из React-узлов (для генерации id на H2). */
const childrenToText = (children: ReactNode): string => {
  if (children === null || children === undefined) return "";
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children))
    return children.map((c) => childrenToText(c as ReactNode)).join("");
  if (typeof children === "object" && "props" in children)
    return childrenToText(
      (children as { props: { children: ReactNode } }).props.children,
    );
  return "";
};

export const markdownComponents: Components = {
  a: ({ href, children, ...rest }) => {
    if (isHexletHref(href)) {
      return <span className="prose-link prose-link--disabled">{children}</span>;
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },

  h2: ({ node: _node, children, ...rest }) => {
    const text = childrenToText(children);
    const id = headingToId(text);
    return (
      <h2 id={id} {...rest}>
        {children}
      </h2>
    );
  },

  img: ({ src, ...rest }) => <img src={resolveReadmeImageSrc(src)} {...rest} />,
};
