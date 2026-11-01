const EXERCISE_LANG_MAP: Record<string, string> = {
  bash: "shell",
  javascript: "javascript",
  typescript: "typescript",
};

export const editorLanguageForFile = (filePath: string, exerciseLanguage?: string): string => {
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".sh")) return "shell";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".jsx")) return "javascript";

  return EXERCISE_LANG_MAP[exerciseLanguage ?? ""] ?? "javascript";
};
