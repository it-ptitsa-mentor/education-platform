import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "./app.js";
import { cabinetResolver, readCookie, CabinetUnavailable, type Resolver } from "./auth.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const exercisesRoot = path.join(repoRoot, "exercises");

const cookie = (token: string) => ({ cookie: `cabinet_session=${token}; other=x` });

// Фейковый резолвер: по токену решает исход (без сети).
const fakeResolver = (map: Record<string, "ok" | "no_access" | "no_session" | "boom">): Resolver => ({
  async resolve(token) {
    const r = map[token];
    if (r === "boom") throw new CabinetUnavailable("down");
    if (!r || r === "no_session") return null;
    return { user: { tg_id: 42, full_name: "Тест" }, allowed: r === "ok" };
  },
});

describe("readCookie", () => {
  it("достаёт нужную куку из заголовка", () => {
    expect(readCookie("a=1; cabinet_session=tok123; b=2")).toBe("tok123");
    expect(readCookie("cabinet_session=%D1%82%D0%BE%D0%BA")).toBe("ток");
    expect(readCookie(undefined)).toBeNull();
    expect(readCookie("nope=1")).toBeNull();
  });
});

describe("гейт education", () => {
  it("гейт выключен без резолвера — тренажёр открыт", async () => {
    const app = buildApp({ exercisesRoot });
    await app.ready();
    const r = await app.inject({ method: "GET", url: "/api/exercises" });
    expect(r.statusCode).toBe(200);
    const me = await app.inject({ method: "GET", url: "/api/me" });
    expect(me.json()).toEqual({ user: null, allowed: true });
    await app.close();
  });

  it("нет куки → 401 на защищённой ручке, health публичен", async () => {
    const app = buildApp({ exercisesRoot, auth: fakeResolver({}) });
    await app.ready();
    expect((await app.inject({ method: "GET", url: "/api/exercises" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/api/health" })).statusCode).toBe(200);
    expect((await app.inject({ method: "GET", url: "/api/me" })).statusCode).toBe(401);
    await app.close();
  });

  it("сессия есть, доступа нет → 403; /api/me отдаёт allowed=false", async () => {
    const app = buildApp({ exercisesRoot, auth: fakeResolver({ t: "no_access" }) });
    await app.ready();
    const ex = await app.inject({ method: "GET", url: "/api/exercises", headers: cookie("t") });
    expect(ex.statusCode).toBe(403);
    const me = await app.inject({ method: "GET", url: "/api/me", headers: cookie("t") });
    expect(me.statusCode).toBe(200);
    expect(me.json()).toMatchObject({ allowed: false, user: { tg_id: 42 } });
    await app.close();
  });

  it("сессия + доступ → 200; тренажёр работает", async () => {
    const app = buildApp({ exercisesRoot, auth: fakeResolver({ t: "ok" }) });
    await app.ready();
    const ex = await app.inject({ method: "GET", url: "/api/exercises", headers: cookie("t") });
    expect(ex.statusCode).toBe(200);
    const me = await app.inject({ method: "GET", url: "/api/me", headers: cookie("t") });
    expect(me.json()).toMatchObject({ allowed: true });
    await app.close();
  });

  it("кабинет недоступен → 503", async () => {
    const app = buildApp({ exercisesRoot, auth: fakeResolver({ t: "boom" }) });
    await app.ready();
    const ex = await app.inject({ method: "GET", url: "/api/exercises", headers: cookie("t") });
    expect(ex.statusCode).toBe(503);
    await app.close();
  });
});

describe("cabinetResolver", () => {
  afterEach(() => vi.restoreAllMocks());

  const mkFetch = (status: number, body: unknown) =>
    vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
    );

  it("200 → AccessInfo, кеширует (второй вызов без сети)", async () => {
    const f = mkFetch(200, { user: { tg_id: 7 }, allowed: true });
    const r = cabinetResolver({ url: "http://cab/x", token: "s", fetchImpl: f as unknown as typeof fetch });
    expect(await r.resolve("tok")).toEqual({ user: { tg_id: 7 }, allowed: true });
    await r.resolve("tok");
    expect(f).toHaveBeenCalledTimes(1); // кеш
  });

  it("401 → null (нет сессии)", async () => {
    const f = mkFetch(401, {});
    const r = cabinetResolver({ url: "http://cab/x", token: "s", fetchImpl: f as unknown as typeof fetch });
    expect(await r.resolve("tok")).toBeNull();
  });

  it("сетевой сбой → CabinetUnavailable", async () => {
    const f = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    const r = cabinetResolver({ url: "http://cab/x", token: "s", fetchImpl: f as unknown as typeof fetch });
    await expect(r.resolve("tok")).rejects.toBeInstanceOf(CabinetUnavailable);
  });

  it("шлёт service=education и X-Internal-Token", async () => {
    const f = mkFetch(200, { user: { tg_id: 1 }, allowed: false });
    const r = cabinetResolver({ url: "http://cab/x", token: "SECRET", fetchImpl: f as unknown as typeof fetch });
    await r.resolve("tok");
    const init = f.mock.calls[0][1] as RequestInit;
    expect(init.headers).toMatchObject({ "X-Internal-Token": "SECRET" });
    expect(JSON.parse(init.body as string)).toEqual({ token: "tok", service: "education" });
  });
});
