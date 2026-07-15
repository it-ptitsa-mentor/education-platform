// Состояние авторизации тренажёра (единый вход через кабинет IT Птицы).
// Чистая логика — тестируется без сети и React.

export type AuthState =
  | { kind: "loading" }
  | { kind: "ok"; user: AuthUser }
  | { kind: "anon" } // нет сессии → показать вход
  | { kind: "no_access"; user: AuthUser } // залогинен, но нет доступа к тренажёру
  | { kind: "unavailable" }; // кабинет/сеть недоступны

export type AuthUser = { tg_id: number; full_name?: string | null; username?: string | null };

const useStaticApi = import.meta.env.VITE_STATIC_API === "true";

/** База кабинета (провайдер входа); переопределяется VITE_CABINET_URL. */
export const CABINET_URL =
  (import.meta.env.VITE_CABINET_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://cabinet.it-ptitsa-mentor.ru";

/** Ссылка на кабинет для входа/запроса доступа. */
export const cabinetLoginUrl = (): string => CABINET_URL;

/** Раскладывает ответ /api/me в состояние гейта. Чистая. */
export const authStateFromResponse = (
  status: number,
  body: { user?: AuthUser | null; allowed?: boolean } | null,
): AuthState => {
  if (status === 401) return { kind: "anon" };
  if (status >= 500 || status === 0) return { kind: "unavailable" };
  if (status === 200 && body) {
    // гейт выключен на бэке (dev/static) → user=null, allowed=true
    if (body.user == null) return { kind: "ok", user: { tg_id: 0 } };
    return body.allowed
      ? { kind: "ok", user: body.user }
      : { kind: "no_access", user: body.user };
  }
  return { kind: "unavailable" };
};

/** Грузит состояние авторизации. В статик-режиме гейта нет — сразу ok. */
export const loadAuthState = async (
  fetchImpl: typeof fetch = fetch,
): Promise<AuthState> => {
  if (useStaticApi) return { kind: "ok", user: { tg_id: 0 } };
  try {
    const res = await fetchImpl("/api/me", { credentials: "include" });
    const body = (await res.json().catch(() => null)) as
      | { user?: AuthUser | null; allowed?: boolean }
      | null;
    return authStateFromResponse(res.status, body);
  } catch {
    return { kind: "unavailable" };
  }
};
