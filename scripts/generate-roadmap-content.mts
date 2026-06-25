/**
 * Копирует content/roadmap/*.json → packages/web/public/roadmap/
 * Запуск: pnpm generate:roadmap-content
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcDir = resolve(root, "content", "roadmap");
const outDir = resolve(root, "packages", "web", "public", "roadmap");

if (!existsSync(srcDir)) {
  console.error("✗ нет content/roadmap — сначала: pnpm export:roadmap-content");
  process.exit(1);
}

const files = readdirSync(srcDir).filter((f) => f.endsWith(".json"));
if (!files.length) {
  console.error("✗ content/roadmap пуст");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
for (const file of files) {
  cpSync(resolve(srcDir, file), resolve(outDir, file));
}

console.log(`✓ роадмап → ${outDir} (${files.length} файл(ов))`);
