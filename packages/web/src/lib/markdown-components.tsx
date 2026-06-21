import type { Components } from "react-markdown";

const isHexletHref = (href?: string) =>
  Boolean(href && /hexlet\.io/i.test(href));

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
};
