import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentTrack } from "./track";

describe("getCurrentTrack", () => {
  const localStorageStore = new Map<string, string>();

  beforeEach(() => {
    localStorageStore.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => localStorageStore.get(key) ?? null,
      setItem: (key: string, value: string) => {
        localStorageStore.set(key, value);
      },
      removeItem: (key: string) => {
        localStorageStore.delete(key);
      },
    });
    // Сброс URL
    vi.stubGlobal("window", {
      location: { search: "" },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("возвращает 'frontend' по умолчанию", () => {
    expect(getCurrentTrack()).toBe("frontend");
  });

  it("читает трек из localStorage", () => {
    localStorageStore.set("ptitsa.track", "go");
    expect(getCurrentTrack()).toBe("go");
  });

  it("читает трек из URL ?track=", () => {
    vi.stubGlobal("window", {
      location: { search: "?track=go" },
    });
    expect(getCurrentTrack()).toBe("go");
  });

  it("URL-параметр имеет приоритет над localStorage", () => {
    localStorageStore.set("ptitsa.track", "frontend");
    vi.stubGlobal("window", {
      location: { search: "?track=go" },
    });
    expect(getCurrentTrack()).toBe("go");
  });

  it("игнорирует неизвестное значение в localStorage и возвращает дефолт", () => {
    localStorageStore.set("ptitsa.track", "python");
    expect(getCurrentTrack()).toBe("frontend");
  });

  it("игнорирует неизвестный track= в URL и возвращает дефолт", () => {
    vi.stubGlobal("window", {
      location: { search: "?track=unknown" },
    });
    expect(getCurrentTrack()).toBe("frontend");
  });

  it("возвращает 'frontend' при пустом URL и пустом localStorage", () => {
    vi.stubGlobal("window", {
      location: { search: "" },
    });
    expect(getCurrentTrack()).toBe("frontend");
  });
});
