import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadQuizManifest, toCategorizedQuizSummary } from "../packages/shared/src/quiz-manifest.ts";
import { toPublicQuizDetail } from "../packages/shared/src/quiz-check.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quizzesRoot = path.join(repoRoot, "quizzes");
const outputDir = path.join(repoRoot, "packages/web/src/generated");

const writeJson = async (fileName: string, data: unknown) => {
  await writeFile(path.join(outputDir, fileName), `${JSON.stringify(data)}\n`, "utf8");
};

const entries = await readdir(quizzesRoot, { withFileTypes: true });
const loaded = await Promise.all(
  entries
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const manifest = await loadQuizManifest(
        path.join(quizzesRoot, entry.name, "quiz.json"),
      );
      return {
        summary: toCategorizedQuizSummary(manifest),
        detail: toPublicQuizDetail(manifest),
        manifest,
      };
    }),
);

const summaries = loaded.map(({ summary }) => summary);
const quizzes = loaded.map(({ detail }) => detail);
const quizManifests = loaded.map(({ manifest }) => manifest);

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeJson("quiz-summaries.json", summaries),
  writeJson("quiz-details.json", quizzes),
  writeJson("quiz-manifests.json", quizManifests),
]);

console.log(`Wrote ${quizzes.length} quiz(zes) to ${outputDir}`);
