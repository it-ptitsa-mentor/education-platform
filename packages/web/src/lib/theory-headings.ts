/** Генерация id-якоря из текста заголовка (поддерживает кириллицу). */
export const headingToId = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\wЀ-ӿ-]/g, "")
    .replace(/-+/g, "-");

export type HeadingItem = { id: string; text: string };

/** Извлечь все H2 из markdown-текста. */
export const extractH2Headings = (md: string): HeadingItem[] => {
  const result: HeadingItem[] = [];
  for (const line of md.split("\n")) {
    const m = /^## (.+)$/.exec(line);
    if (m) {
      const text = m[1].trim();
      result.push({ text, id: headingToId(text) });
    }
  }
  return result;
};
