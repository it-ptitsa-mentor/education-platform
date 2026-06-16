export type ExerciseSummary = { slug: string; title: string };

export type ExerciseDetail = {
  slug: string;
  title: string;
  language: string;
  filesToOpen: string[];
  readme: string;
  files: Record<string, string>;
};

export type CheckResult = {
  passed: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

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

export const fetchExercises = () =>
  request<{ exercises: ExerciseSummary[] }>("/api/exercises");

export const fetchExercise = (slug: string) =>
  request<ExerciseDetail>(`/api/exercises/${slug}`);

export const checkExercise = (slug: string, files: Record<string, string>) =>
  request<CheckResult>(`/api/exercises/${slug}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
