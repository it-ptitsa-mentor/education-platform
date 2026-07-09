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

export const collectAssertionErrors = (
  checks: Array<string | null>,
): string[] => checks.filter((message): message is string => message !== null);
