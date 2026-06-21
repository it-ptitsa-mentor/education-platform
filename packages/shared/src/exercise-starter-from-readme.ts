import path from "node:path";

const languagePatternForFile = (fileName: string): string => {
  const ext = path.extname(fileName).slice(1);

  if (ext === "js" || ext === "jsx") return "(?:javascript|js|jsx)";
  if (ext === "ts" || ext === "tsx") return "(?:typescript|ts|tsx)";
  if (ext === "html") return "html";
  if (ext === "css") return "css";

  return "shell|bash|sh";
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const extractCodeFromReadme = (
  readme: string,
  fileName: string,
  filesToOpen: string[],
): string | null => {
  const langPattern = languagePatternForFile(fileName);
  const escapedFileName = escapeRegExp(fileName);
  const sectionMatch = readme.match(
    new RegExp(
      `###\\s+${escapedFileName}[\\s\\S]*?\`\`\`${langPattern}\\n([\\s\\S]*?)\`\`\``,
      "i",
    ),
  );

  if (sectionMatch?.[1]) {
    return sectionMatch[1].trim();
  }

  const blocks = [
    ...readme.matchAll(new RegExp(`\`\`\`${langPattern}\\n([\\s\\S]*?)\`\`\``, "gi")),
  ];

  if (blocks.length === 0) return null;

  const typedExercise =
    /наберите|символ в символ|type the following|copy the code/i.test(readme);

  if (filesToOpen.length === 1 && (typedExercise || blocks.length === 1)) {
    const content = blocks[0]?.[1];
    if (content) return content.trim();
  }

  return null;
};

export const starterForFile = (
  fileName: string,
  readme: string,
  language: string,
  filesToOpen: string[],
): string => {
  const fromReadme = extractCodeFromReadme(readme, fileName, filesToOpen);
  if (fromReadme) return fromReadme;

  if (fileName.endsWith(".html")) {
    return "<!DOCTYPE html>\n<html lang=\"ru\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Exercise</title>\n  </head>\n  <body>\n    <!-- Решение -->\n  </body>\n</html>\n";
  }

  if (fileName.endsWith(".css")) {
    return "/* Стили упражнения */\n";
  }

  if (fileName.endsWith(".jsx") || fileName.endsWith(".tsx")) {
    const componentName = path
      .basename(fileName, path.extname(fileName))
      .replace(/[^a-zA-Z0-9_$]/g, "");

    return `// Компонент упражнения\nexport default function ${componentName || "App"}() {\n  return null;\n}\n`;
  }

  if (fileName.endsWith(".ts")) {
    return "// Решение упражнения\n";
  }

  if (language === "shell" || fileName === "solution") {
    return "#!/bin/bash\n# Решение упражнения\n";
  }

  return "// Решение упражнения\n";
};
