import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "./app.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const app = buildApp({
  exercisesRoot: path.join(repoRoot, "exercises"),
});

const port = Number(process.env.PORT ?? 4100);
const host = process.env.HOST ?? "0.0.0.0";

await app.listen({ port, host });
console.log(`API listening on http://${host}:${port}`);
