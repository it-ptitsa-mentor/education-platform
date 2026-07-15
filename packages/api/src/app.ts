import cors from "@fastify/cors";
import { readdir } from "node:fs/promises";
import path from "node:path";
import Fastify, { type FastifyInstance } from "fastify";
import { runExerciseCheck, readStarterFiles } from "@ptitsa/runner";
import { readCookie, type Resolver } from "./auth.js";
import {
  checkQuizAnswers,
  loadExerciseManifest,
  loadQuizManifest,
  toCategorizedExerciseSummary,
  toCategorizedQuizSummary,
  toPublicQuizDetail,
} from "@ptitsa/shared";

export type AppOptions = {
  exercisesRoot: string;
  quizzesRoot?: string;
  /** Резолвер доступа (единый вход через кабинет). Не задан — гейт выключен (dev/тесты). */
  auth?: Resolver;
};

// Публичные ручки — без гейта. Всё остальное под /api/exercises*, /api/quizzes* — за логином.
const isPublic = (url: string): boolean => {
  const path = url.split("?")[0];
  return path === "/api/health" || path === "/api/me";
};

export const buildApp = ({ exercisesRoot, quizzesRoot, auth }: AppOptions): FastifyInstance => {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: true });

  // Гейт: читаем куку кабинета, резолвим доступ к education.
  // 401 — нет сессии (SPA покажет вход); 403 — нет доступа (SPA: запросить доступ);
  // 503 — кабинет недоступен. Публичные ручки пропускаем. auth не задан — гейт off.
  if (auth) {
    app.addHook("preHandler", async (request, reply) => {
      if (isPublic(request.url)) return;
      const token = readCookie(request.headers.cookie);
      if (!token) return reply.status(401).send({ error: "unauthenticated" });
      try {
        const info = await auth.resolve(token);
        if (!info) return reply.status(401).send({ error: "unauthenticated" });
        if (!info.allowed) return reply.status(403).send({ error: "no_access" });
      } catch {
        return reply.status(503).send({ error: "auth_unavailable" });
      }
    });
  }

  app.get("/api/health", async () => ({ ok: true }));

  // Кто я + есть ли доступ к тренажёру (для экрана входа в SPA).
  app.get("/api/me", async (request, reply) => {
    if (!auth) return { user: null, allowed: true }; // гейт off — всё открыто
    const token = readCookie(request.headers.cookie);
    if (!token) return reply.status(401).send({ error: "unauthenticated" });
    try {
      const info = await auth.resolve(token);
      if (!info) return reply.status(401).send({ error: "unauthenticated" });
      return { user: info.user, allowed: info.allowed };
    } catch {
      return reply.status(503).send({ error: "auth_unavailable" });
    }
  });

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

  if (quizzesRoot) {
    app.get("/api/quizzes", async () => {
      const entries = await readdir(quizzesRoot, { withFileTypes: true });
      const quizzes = (
        await Promise.all(
          entries
            .filter((entry) => entry.isDirectory())
            .map(async (entry) => {
              try {
                const manifest = await loadQuizManifest(
                  path.join(quizzesRoot, entry.name, "quiz.json"),
                );
                return toCategorizedQuizSummary(manifest);
              } catch {
                return null;
              }
            }),
        )
      ).filter((item): item is ReturnType<typeof toCategorizedQuizSummary> => item !== null);

      return { quizzes };
    });

    app.get<{ Params: { slug: string } }>(
      "/api/quizzes/:slug",
      async (request, reply) => {
        const { slug } = request.params;

        try {
          const manifest = await loadQuizManifest(
            path.join(quizzesRoot, slug, "quiz.json"),
          );

          return toPublicQuizDetail(manifest);
        } catch {
          return reply.status(404).send({ error: "Quiz not found" });
        }
      },
    );

    app.post<{
      Params: { slug: string };
      Body: { answers?: Record<string, string[]> };
    }>("/api/quizzes/:slug/check", async (request, reply) => {
      const { slug } = request.params;
      const answers = request.body?.answers;

      if (!answers || Object.keys(answers).length === 0) {
        return reply.status(400).send({ error: "answers required" });
      }

      try {
        const manifest = await loadQuizManifest(
          path.join(quizzesRoot, slug, "quiz.json"),
        );

        return checkQuizAnswers(manifest, { answers });
      } catch {
        return reply.status(404).send({ error: "Quiz not found" });
      }
    });
  }

  return app;
};
