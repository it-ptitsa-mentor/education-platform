export const editorLanguageForFile = (filePath: string): string => {
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".sh")) return "shell";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";

  return "javascript";
};
