/**
 * Фаза 2: структурные проверки HTML/CSS.
 *
 * Функции принимают контент файлов строками и возвращают:
 *   null   — проверка прошла
 *   string — описание ошибки
 *
 * Работают как в jsdom/Vitest, так и в browser-check (без внешних зависимостей).
 */

// ── HTML helpers ──────────────────────────────────────────────────────────────

/**
 * Проверяет, что HTML-файл содержит как минимум один из указанных тегов.
 * Использует простой regex — достаточно для проверки наличия структуры.
 */
export const assertHtmlHasTag = (
  html: string,
  tag: string,
  filePath: string,
): string | null => {
  const pattern = new RegExp(`<${tag}[\\s/>]`, "i");
  if (!pattern.test(html)) {
    return `${filePath}: ожидается тег <${tag}>`;
  }
  return null;
};

/**
 * Проверяет, что HTML содержит хотя бы один из перечисленных тегов.
 */
export const assertHtmlHasAnyTag = (
  html: string,
  tags: string[],
  filePath: string,
): string | null => {
  const found = tags.some((tag) => new RegExp(`<${tag}[\\s/>]`, "i").test(html));
  if (!found) {
    return `${filePath}: ожидается хотя бы один из тегов: ${tags.map((t) => `<${t}>`).join(", ")}`;
  }
  return null;
};

/**
 * Проверяет, что HTML содержит все перечисленные теги.
 */
export const assertHtmlHasAllTags = (
  html: string,
  tags: string[],
  filePath: string,
): string | null => {
  const missing = tags.filter(
    (tag) => !new RegExp(`<${tag}[\\s/>]`, "i").test(html),
  );
  if (missing.length > 0) {
    return `${filePath}: не найдены обязательные теги: ${missing.map((t) => `<${t}>`).join(", ")}`;
  }
  return null;
};

/**
 * Проверяет, что HTML содержит заданный текст (регистронезависимо).
 */
export const assertHtmlContainsText = (
  html: string,
  text: string,
  filePath: string,
): string | null => {
  if (!html.toLowerCase().includes(text.toLowerCase())) {
    return `${filePath}: ожидается текст «${text}»`;
  }
  return null;
};

// ── CSS helpers ───────────────────────────────────────────────────────────────

/**
 * Проверяет, что CSS содержит хотя бы одно использование указанного свойства.
 */
export const assertCssHasProperty = (
  css: string,
  property: string,
  filePath: string,
): string | null => {
  // Match property: value (ignoring property-with-dashes like `background-image` vs `background`)
  const pattern = new RegExp(
    `(?:^|[{;,\\s])${property.replace(/[-]/g, "[-]")}\\s*:`,
    "mi",
  );
  if (!pattern.test(css)) {
    return `${filePath}: ожидается CSS-свойство «${property}»`;
  }
  return null;
};

/**
 * Проверяет, что CSS содержит хотя бы одно из перечисленных свойств.
 */
export const assertCssHasAnyProperty = (
  css: string,
  properties: string[],
  filePath: string,
): string | null => {
  const found = properties.some((property) => {
    const pattern = new RegExp(
      `(?:^|[{;,\\s])${property.replace(/[-]/g, "[-]")}\\s*:`,
      "mi",
    );
    return pattern.test(css);
  });
  if (!found) {
    return `${filePath}: ожидается хотя бы одно из CSS-свойств: ${properties.join(", ")}`;
  }
  return null;
};

/**
 * Проверяет, что CSS содержит все перечисленные свойства.
 */
export const assertCssHasAllProperties = (
  css: string,
  properties: string[],
  filePath: string,
): string | null => {
  const missing = properties.filter((property) => {
    const pattern = new RegExp(
      `(?:^|[{;,\\s])${property.replace(/[-]/g, "[-]")}\\s*:`,
      "mi",
    );
    return !pattern.test(css);
  });
  if (missing.length > 0) {
    return `${filePath}: не найдены обязательные CSS-свойства: ${missing.join(", ")}`;
  }
  return null;
};

/**
 * Проверяет, что CSS содержит значение, соответствующее паттерну.
 * Например: assertCssHasValue(css, 'width', /300px/, 'app.css')
 */
export const assertCssHasValue = (
  css: string,
  property: string,
  valuePattern: RegExp,
  filePath: string,
): string | null => {
  // Find lines/blocks containing the property
  const propPattern = new RegExp(
    `(?:^|[{;,\\s])${property.replace(/[-]/g, "[-]")}\\s*:\\s*([^;}{\\n]+)`,
    "gim",
  );
  const matches = [...css.matchAll(propPattern)];
  if (matches.length === 0) {
    return `${filePath}: ожидается CSS-свойство «${property}»`;
  }
  const anyMatch = matches.some((m) => valuePattern.test(m[1] ?? ""));
  if (!anyMatch) {
    return `${filePath}: свойство «${property}» не содержит ожидаемое значение (${valuePattern})`;
  }
  return null;
};

/**
 * Проверяет наличие CSS-переменных (custom properties --name).
 */
export const assertCssHasCustomProperty = (
  css: string,
  name: string,
  filePath: string,
): string | null => {
  const pattern = new RegExp(`--${name.replace(/^--/, "")}\\s*:`, "m");
  if (!pattern.test(css)) {
    return `${filePath}: ожидается CSS-переменная «--${name.replace(/^--/, "")}»`;
  }
  return null;
};

/**
 * Проверяет наличие псевдоэлемента (::before / ::after).
 */
export const assertCssHasPseudoElement = (
  css: string,
  pseudo: "before" | "after" | "first-letter" | "first-line" | "placeholder",
  filePath: string,
): string | null => {
  const pattern = new RegExp(`::${pseudo}`, "im");
  if (!pattern.test(css)) {
    return `${filePath}: ожидается псевдоэлемент «::${pseudo}»`;
  }
  return null;
};

/**
 * Проверяет наличие псевдокласса.
 */
export const assertCssHasPseudoClass = (
  css: string,
  pseudo: string,
  filePath: string,
): string | null => {
  const pattern = new RegExp(`:${pseudo.replace(/[()]/g, (c) => `\\${c}`)}`, "im");
  if (!pattern.test(css)) {
    return `${filePath}: ожидается псевдокласс «:${pseudo}»`;
  }
  return null;
};

/**
 * Проверяет наличие медиа-запроса.
 */
export const assertCssHasMediaQuery = (css: string, filePath: string): string | null => {
  if (!/@media\b/im.test(css)) {
    return `${filePath}: ожидается медиа-запрос (@media)`;
  }
  return null;
};

/**
 * Проверяет наличие CSS-правила (блока с { ... }).
 */
export const assertCssHasRules = (css: string, filePath: string): string | null => {
  if (!/\{[\s\S]*?\}/.test(css.trim())) {
    return `${filePath}: ожидаются CSS-правила (не найдено ни одного блока)`;
  }
  return null;
};

/**
 * Собирает непустые ошибки из массива результатов проверок.
 */
export const collectStructuralErrors = (checks: Array<string | null>): string[] =>
  checks.filter((msg): msg is string => msg !== null);
