import { describe, expect, it } from "vitest";
import { authStateFromResponse } from "./authState";

describe("authStateFromResponse", () => {
  it("401 → нет сессии (вход)", () => {
    expect(authStateFromResponse(401, null)).toEqual({ kind: "anon" });
  });

  it("200 + allowed → ok с пользователем", () => {
    expect(authStateFromResponse(200, { user: { tg_id: 7, full_name: "А" }, allowed: true })).toEqual({
      kind: "ok",
      user: { tg_id: 7, full_name: "А" },
    });
  });

  it("200 + allowed=false → нет доступа", () => {
    const s = authStateFromResponse(200, { user: { tg_id: 7 }, allowed: false });
    expect(s.kind).toBe("no_access");
  });

  it("200 + user=null (гейт off) → ok", () => {
    expect(authStateFromResponse(200, { user: null, allowed: true }).kind).toBe("ok");
  });

  it("503 и сетевой 0 → недоступно", () => {
    expect(authStateFromResponse(503, null)).toEqual({ kind: "unavailable" });
    expect(authStateFromResponse(0, null)).toEqual({ kind: "unavailable" });
  });
});
