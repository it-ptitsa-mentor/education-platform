/**
 * Готовит контент курса для веб-приложения:
 *   content/course.json   → packages/web/public/course/course.json
 *   content/theory/**.md   → packages/web/public/course/theory/**
 *
 * Приложение тянет это лениво (fetch), чтобы не раздувать бандл.
 * Запуск: pnpm generate:course-content  (или внутри build)
 */
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcCourse = resolve(root, "content", "course.json");
const srcTheory = resolve(root, "content", "theory");
const outDir = resolve(root, "packages", "web", "public", "course");

if (!existsSync(srcCourse)) {
  console.error("✗ нет content/course.json — сначала: python3 scripts/build-course-model.py");
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(srcCourse, resolve(outDir, "course.json"));
cpSync(srcTheory, resolve(outDir, "theory"), { recursive: true });

console.log(`✓ контент курса → ${outDir}`);
