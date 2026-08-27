import { beforeEach, describe, expect, it } from "vitest";
import {
  clearLessonOrigin,
  readLessonOrigin,
  rememberLessonOrigin,
} from "./lesson-origin";

describe("lesson-origin", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("возвращает null, когда точка входа неизвестна", () => {
    expect(readLessonOrigin("")).toBeNull();
  });

  it("запоминает и читает роадмап входа", () => {
    rememberLessonOrigin({ roadmapId: "frontend-bootcamp" });
    expect(readLessonOrigin("")).toEqual({ roadmapId: "frontend-bootcamp" });
  });

  it("сохраняет узел роадмапа, если он известен", () => {
    rememberLessonOrigin({ roadmapId: "react-first", nodeId: "rf-w1-t0" });
    expect(readLessonOrigin("")).toEqual({
      roadmapId: "react-first",
      nodeId: "rf-w1-t0",
    });
  });

  it("URL ?from= приоритетнее localStorage", () => {
    rememberLessonOrigin({ roadmapId: "frontend-bootcamp" });
    expect(readLessonOrigin("?from=react-first")).toEqual({
      roadmapId: "react-first",
    });
  });

  it("читает узел из ?fromNode=", () => {
    expect(readLessonOrigin("?from=react-first&fromNode=rf-w2-t1")).toEqual({
      roadmapId: "react-first",
      nodeId: "rf-w2-t1",
    });
  });

  it("игнорирует пустой ?from=", () => {
    rememberLessonOrigin({ roadmapId: "frontend-bootcamp" });
    expect(readLessonOrigin("?from=")).toEqual({
      roadmapId: "frontend-bootcamp",
    });
  });

  it("не падает на битом значении в localStorage", () => {
    localStorage.setItem("ptitsa.lesson-origin", "{not json");
    expect(readLessonOrigin("")).toBeNull();
  });

  it("игнорирует запись без roadmapId", () => {
    localStorage.setItem("ptitsa.lesson-origin", JSON.stringify({ nodeId: "x" }));
    expect(readLessonOrigin("")).toBeNull();
  });

  it("не перезаписывает origin пустым roadmapId", () => {
    rememberLessonOrigin({ roadmapId: "frontend-bootcamp" });
    rememberLessonOrigin({ roadmapId: "" });
    expect(readLessonOrigin("")).toEqual({ roadmapId: "frontend-bootcamp" });
  });

  it("clearLessonOrigin сбрасывает точку входа", () => {
    rememberLessonOrigin({ roadmapId: "frontend-bootcamp" });
    clearLessonOrigin();
    expect(readLessonOrigin("")).toBeNull();
  });
});
