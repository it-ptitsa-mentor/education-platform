export const assertNonEmpty = (content: string, filePath: string): string | null => {
  if (content.trim().length === 0) {
    return `${filePath} must not be empty`;
  }

  return null;
};

export const assertJsxComponent = (source: string, filePath: string): string | null => {
  // Accept `export default App`, `export default connect(...)(Foo)`,
  // `export default () => ...` alongside function/class/const forms;
  // literals like `export default 1` still fail.
  const exportsComponent =
    /export\s+default\s+(?:function|class|[A-Za-z_$(])/.test(source) ||
    /export\s+(?:function|class|const)/.test(source);
  if (!exportsComponent) {
    return `${filePath} must export a component`;
  }

  return null;
};

export const assertHtmlMarkup = (html: string, filePath: string): string | null => {
  const lower = html.toLowerCase();
  if (!/<html|<!doctype|<body|<div|<main|<section/.test(lower)) {
    return `${filePath} must contain html markup`;
  }

  return null;
};

export const assertCssRules = (css: string, filePath: string): string | null => {
  const emptyError = assertNonEmpty(css, filePath);
  if (emptyError) return emptyError;

  if (!/\{[\s\S]*\}/.test(css)) {
    return `${filePath} must contain css rules`;
  }

  return null;
};

/**
 * Assert that every required CSS class name appears at least once in the HTML
 * (as a value inside a class="..." attribute).
 * Returns one error string per missing class.
 */
export const assertRequiredClasses = (
  html: string,
  requiredClasses: string[],
): Array<string | null> => {
  const studentClasses = new Set<string>();
  const classRe = /class="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(html)) !== null) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls) studentClasses.add(cls);
    }
  }
  return requiredClasses.map((cls) =>
    studentClasses.has(cls) ? null : `в разметке нет элемента с классом «${cls}»`,
  );
};

/**
 * Assert that every required CSS selector appears in the student's CSS
 * (followed by optional whitespace and `{`).
 * Returns one error string per missing selector.
 */
export const assertRequiredSelectors = (
  css: string,
  requiredSelectors: string[],
): Array<string | null> => {
  return requiredSelectors.map((selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped + "\\s*\\{");
    return re.test(css) ? null : `в CSS не описан селектор «${selector}»`;
  });
};

export const collectAssertionErrors = (
  checks: Array<string | null>,
): string[] => checks.filter((message): message is string => message !== null);
