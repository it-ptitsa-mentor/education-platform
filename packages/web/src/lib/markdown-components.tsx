import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { headingToId } from "./theory-headings";

const isHexletHref = (href?: string) =>
  Boolean(href && /hexlet\.io/i.test(href));

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
};
