// Collapse whitespace so cosmetic edits (trailing newline, reindent) still
// count as "unchanged" — used only to reject a pristine starter submission.
export const normalizeSource = (source: string): string =>
  source.replace(/\s+/g, " ").trim();

// The static (browser) checker runs weak per-kind heuristics, not the real
// __tests__ — so an untouched starter can slip through as "passed". Until the
// server-side vitest runner is live (Backend API), a submission that is
// byte-for-byte the starter must be refused, so students can't complete a
// task without editing.
export const isPristineStarter = (
  starters: Record<string, string>,
  studentFiles: Record<string, string>,
  studentFilePaths: readonly string[],
): boolean => {
  const targets = studentFilePaths.length > 0
    ? studentFilePaths
    : Object.keys(starters);
  if (targets.length === 0) {
    return false;
  }
  return targets.every(
    (filePath) =>
      normalizeSource(studentFiles[filePath] ?? "") ===
      normalizeSource(starters[filePath] ?? ""),
  );
};
