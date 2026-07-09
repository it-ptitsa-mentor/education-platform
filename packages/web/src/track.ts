/**
 * Трек профессии студента.
 *
 * getCurrentTrack() — ЕДИНСТВЕННАЯ точка получения текущего трека.
 * Когда в ЛК появится профиль с полем profession — заменить тело
 * этой функции на чтение из профиля. Нигде больше логика трека
 * дублироваться не должна.
 */

export type ProfessionTrack = "frontend" | "go";

const VALID_TRACKS: readonly ProfessionTrack[] = ["frontend", "go"];
const STORAGE_KEY = "ptitsa.track";
const DEFAULT_TRACK: ProfessionTrack = "frontend";

const isValidTrack = (v: string | null | undefined): v is ProfessionTrack =>
  VALID_TRACKS.includes(v as ProfessionTrack);

/**
 * Возвращает текущий трек профессии студента.
 *
 * Приоритет источников:
 * 1. URL-параметр `?track=frontend` (удобно для дебага / ручного теста)
 * 2. localStorage под ключом `ptitsa.track`
 * 3. Дефолт — `"frontend"` (единственный активный трек на старте)
 *
 * — При подключении ЛК: заменить тело этой функции на `await getProfile().track`.
 * — Весь остальной код остаётся без изменений.
 */
export const getCurrentTrack = (): ProfessionTrack => {
  if (typeof window !== "undefined") {
    // 1. URL ?track=
    const param = new URLSearchParams(window.location.search).get("track");
    if (isValidTrack(param)) return param;

    // 2. localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidTrack(stored)) return stored;
    } catch {
      // Ignore — возможно SSR или заблокированный storage
    }
  }

  // 3. Default
  return DEFAULT_TRACK;
};
