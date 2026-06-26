/**
 * В dev: копирует markdown из content/theory в public/course/theory при сохранении.
 * Полная синхронизация (course.json и т.д.) — pnpm generate:course-content
 */
import { cpSync, existsSync, mkdirSync, watch } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcRoot = resolve(root, "content", "theory");
const outRoot = resolve(root, "packages", "web", "public", "course", "theory");

const copyMd = (absPath: string) => {
  if (!absPath.endsWith(".md")) return;
  const rel = relative(srcRoot, absPath);
  if (rel.startsWith("..")) return;
  const dest = resolve(outRoot, rel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(absPath, dest);
  console.log(`↻ ${rel}`);
};

console.log(`Слежу за ${srcRoot}`);
console.log(`→ ${outRoot}`);
console.log("Сохраните .md в content/theory — обновите страницу в браузере.\n");

watch(srcRoot, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith(".md")) return;
  const abs = resolve(srcRoot, filename);
  if (existsSync(abs)) copyMd(abs);
});
