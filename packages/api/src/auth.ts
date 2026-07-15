// Гейт education: единый вход через куку кабинета.
//
// Кабинет ставит сессию на родительский домен .it-ptitsa-mentor.ru, поэтому кука
// cabinet_session долетает и до education.*. Здесь мы её читаем и резолвим через
// внутреннюю ручку кабинета (X-Internal-Token) в пользователя + признак доступа
// к сервису education. Сеть изолирована в resolveViaCabinet; парсер/кеш — чистые.

const COOKIE_NAME = "cabinet_session";

export type AccessInfo = {
  user: { tg_id: number; full_name?: string | null; username?: string | null };
  allowed: boolean;
};

/** Достаёт значение одной куки из заголовка Cookie (без внешних зависимостей). */
export const readCookie = (header: string | undefined, name = COOKIE_NAME): string | null => {
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
};

export class CabinetUnavailable extends Error {}

export type Resolver = {
  /** null — сессии нет/невалидна (401); AccessInfo — пользователь + allowed; throws CabinetUnavailable при сбое кабинета. */
  resolve(token: string): Promise<AccessInfo | null>;
};

export type ResolverConfig = {
  url: string; // ручка кабинета resolve-session
  token: string; // X-Internal-Token
  service?: string; // сервис для проверки доступа (default "education")
  ttlMs?: number; // кеш резолва по токену
  fetchImpl?: typeof fetch; // подмена в тестах
};

/**
 * Резолвер поверх кабинета с коротким кешем по токену (не бить кабинет на каждый запрос).
 * Возвращает null на 401 (нет сессии), AccessInfo на 200, кидает CabinetUnavailable иначе.
 */
export const cabinetResolver = (cfg: ResolverConfig): Resolver => {
  const service = cfg.service ?? "education";
  const ttl = cfg.ttlMs ?? 30_000;
  const doFetch = cfg.fetchImpl ?? fetch;
  const cache = new Map<string, { value: AccessInfo | null; exp: number }>();

  return {
    async resolve(token: string): Promise<AccessInfo | null> {
      const now = Date.now();
      const hit = cache.get(token);
      if (hit && hit.exp > now) return hit.value;

      let res: Response;
      try {
        res = await doFetch(cfg.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Internal-Token": cfg.token },
          body: JSON.stringify({ token, service }),
        });
      } catch (e) {
        throw new CabinetUnavailable(String(e));
      }
      if (res.status === 401) {
        cache.set(token, { value: null, exp: now + ttl });
        return null;
      }
      if (!res.ok) {
        throw new CabinetUnavailable(`cabinet ${res.status}`);
      }
      const data = (await res.json()) as { user: AccessInfo["user"]; allowed: boolean };
      const info: AccessInfo = { user: data.user, allowed: !!data.allowed };
      cache.set(token, { value: info, exp: now + ttl });
      return info;
    },
  };
};
