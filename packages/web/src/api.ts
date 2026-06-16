import type {
  CheckResult,
  ExerciseDetail,
  ExerciseSummary,
} from "./exercise-types";

export type {
  CheckResult,
  ExerciseDetail,
  ExerciseSummary,
} from "./exercise-types";

const useStaticApi = import.meta.env.VITE_STATIC_API === "true";

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
  /\/$/,
  "",
) ?? "";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBase}${path}`, init);
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

const loadStaticApi = () => import("./static-api.js");

export const fetchExercises = async () => {
  if (useStaticApi) {
    return (await loadStaticApi()).staticFetchExercises();
  }

  return request<{ exercises: ExerciseSummary[] }>("/api/exercises");
};

export const fetchExercise = async (slug: string) => {
  if (useStaticApi) {
    return (await loadStaticApi()).staticFetchExercise(slug);
  }

  return request<ExerciseDetail>(`/api/exercises/${slug}`);
};

export const checkExercise = async (
  slug: string,
  files: Record<string, string>,
) => {
  if (useStaticApi) {
    return (await loadStaticApi()).staticCheckExercise(slug, files);
  }

  return request<CheckResult>(`/api/exercises/${slug}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
};
