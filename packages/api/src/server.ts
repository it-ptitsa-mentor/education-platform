import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import { buildApp } from "./app.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const app = buildApp({
  exercisesRoot: path.join(repoRoot, "exercises"),
  quizzesRoot: path.join(repoRoot, "quizzes"),
});

const webDist = path.join(repoRoot, "packages/web/dist");
const shouldServeWeb =
  process.env.SERVE_WEB === "true" ||
  (process.env.NODE_ENV === "production" && existsSync(webDist));

if (shouldServeWeb) {
  await app.register(fastifyStatic, {
    root: webDist,
    wildcard: false,
  });

  app.setNotFoundHandler((request, reply) => {
    if (request.method === "GET" && !request.url.startsWith("/api")) {
      return reply.sendFile("index.html", webDist);
    }

    return reply.status(404).send({ error: "Not found" });
  });
}

const port = Number(process.env.PORT ?? 4100);
const host = process.env.HOST ?? "0.0.0.0";

await app.listen({ port, host });
console.log(
  `Server listening on http://${host}:${port}${shouldServeWeb ? " (web + api)" : " (api)"}`,
);
