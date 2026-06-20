import cors from "@fastify/cors";
import { readdir } from "node:fs/promises";
import path from "node:path";
import Fastify, { type FastifyInstance } from "fastify";
import { runExerciseCheck, readStarterFiles } from "@ptitsa/runner";
import { loadExerciseManifest, toCategorizedExerciseSummary } from "@ptitsa/shared";

export type AppOptions = {
  exercisesRoot: string;
};

export const buildApp = ({ exercisesRoot }: AppOptions): FastifyInstance => {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: true });

  app.get("/api/health", async () => ({ ok: true }));

  app.get("/api/exercises", async () => {
    const entries = await readdir(exercisesRoot, { withFileTypes: true });
    const exercises = (
      await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map(async (entry) => {
            try {
              const manifest = await loadExerciseManifest(
                path.join(exercisesRoot, entry.name, "exercise.json"),
              );
              return toCategorizedExerciseSummary(manifest);
            } catch {
              return null;
            }
          }),
      )
    ).filter((item): item is ReturnType<typeof toCategorizedExerciseSummary> => item !== null);

    return { exercises };
  });

  app.get<{ Params: { slug: string } }>(
    "/api/exercises/:slug",
    async (request, reply) => {
      const { slug } = request.params;

      try {
        const manifest = await loadExerciseManifest(
          path.join(exercisesRoot, slug, "exercise.json"),
        );
        const files = await readStarterFiles(exercisesRoot, slug);

        return {
          slug: manifest.slug,
          title: manifest.title,
          language: manifest.language,
          filesToOpen: manifest.filesToOpen,
          readme: manifest.readme,
          files,
        };
      } catch {
        return reply.status(404).send({ error: "Exercise not found" });
      }
    },
  );

  app.post<{
    Params: { slug: string };
    Body: { files?: Record<string, string> };
  }>("/api/exercises/:slug/check", async (request, reply) => {
    const { slug } = request.params;
    const files = request.body?.files;

    if (!files || Object.keys(files).length === 0) {
      return reply.status(400).send({ error: "files required" });
    }

    try {
      const result = await runExerciseCheck({
        exercisesRoot,
        slug,
        studentFiles: files,
      });

      return {
        passed: result.passed,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Check failed";
      return reply.status(400).send({ error: message });
    }
  });

  return app;
};
