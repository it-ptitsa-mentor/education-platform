/** Модель роадмапа + загрузчик JSON (SSOT: content/roadmap/). */

import type { ProfessionTrack } from "./track";

export type RoadmapLink = {
  type: string;
  title: string;
  url: string;
};

export type RoadmapCourseTopic = {
  moduleSlug: string;
  topicSlug: string;
  title: string;
};

export type RoadmapNode = {
  kind: "topic" | "project";
  label: string;
  description: string;
  links: RoadmapLink[];
  classroomUrl?: string;
  courseTopic: RoadmapCourseTopic | null;
};

export type RoadmapWeek = {
  week: number;
  phaseId: string;
  topicIds: string[];
  projectIds: string[];
};

export type RoadmapPhase = {
  id: string;
  label: string;
  weeks: RoadmapWeek[];
};

export type Roadmap = {
  id: string;
  title: string;
  subtitle: string;
  profession: string;
  /** Трек профессии, к которому относится роадмап. */
  track?: ProfessionTrack;
  phases: RoadmapPhase[];
  nodes: Record<string, RoadmapNode>;
};

export type RoadmapCatalogStatus = "active" | "soon";

export type RoadmapCatalogEntry = {
  id: string;
  title: string;
  subtitle: string;
  status: RoadmapCatalogStatus;
  badge?: string;
};

export type ProfessionCatalogEntry = {
  id: string;
  title: string;
  description?: string;
  status?: RoadmapCatalogStatus;
  roadmaps: RoadmapCatalogEntry[];
};

export type RoadmapCatalog = {
  professions: ProfessionCatalogEntry[];
};

const base = import.meta.env.BASE_URL;

const roadmapCache = new Map<string, Roadmap>();
let catalogCache: RoadmapCatalog | null = null;

export const professionPath = (professionId: string): string =>
  `/professions/${encodeURIComponent(professionId)}`;

export const roadmapPath = (roadmapId: string): string =>
  `/roadmaps/${encodeURIComponent(roadmapId)}`;

export const roadmapNodePath = (roadmapId: string, nodeId: string): string =>
  `/roadmaps/${encodeURIComponent(roadmapId)}/${encodeURIComponent(nodeId)}`;

export const loadRoadmapCatalog = async (): Promise<RoadmapCatalog> => {
  if (catalogCache) return catalogCache;
  const res = await fetch(`${base}roadmap/catalog.json`);
  if (!res.ok) throw new Error("Не удалось загрузить каталог роадмапов");
  catalogCache = (await res.json()) as RoadmapCatalog;
  return catalogCache;
};

export const findCatalogProfession = (
  catalog: RoadmapCatalog,
  professionId: string,
): ProfessionCatalogEntry | null =>
  catalog.professions.find((p) => p.id === professionId) ?? null;

export const findCatalogRoadmap = (
  catalog: RoadmapCatalog,
  roadmapId: string,
): { profession: ProfessionCatalogEntry; roadmap: RoadmapCatalogEntry } | null => {
  for (const profession of catalog.professions) {
    const roadmap = profession.roadmaps.find((item) => item.id === roadmapId);
    if (roadmap) return { profession, roadmap };
  }
  return null;
};

export const loadRoadmap = async (roadmapId: string): Promise<Roadmap> => {
  const cached = roadmapCache.get(roadmapId);
  if (cached) return cached;
  const res = await fetch(`${base}roadmap/${roadmapId}.json`);
  if (!res.ok) throw new Error("Не удалось загрузить роадмап");
  const roadmap = (await res.json()) as Roadmap;
  roadmapCache.set(roadmapId, roadmap);
  return roadmap;
};

export const getRoadmapNode = (roadmap: Roadmap, nodeId: string): RoadmapNode | null =>
  roadmap.nodes[nodeId] ?? null;

/** Первый урок темы, шаг «Теория» (как theory_unit на Hexlet). */
export const courseTopicLessonHref = (topic: RoadmapCourseTopic): string =>
  `/learn/${topic.moduleSlug}/${topic.topicSlug}/1/theory`;

const ROADMAP_PROGRESS_KEY = "ptitsa-roadmap-progress";

export const readRoadmapDone = (): Set<string> => {
  try {
    const raw = localStorage.getItem(ROADMAP_PROGRESS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
};

export const markRoadmapNodeDone = (nodeId: string): void => {
  const done = readRoadmapDone();
  done.add(nodeId);
  localStorage.setItem(ROADMAP_PROGRESS_KEY, JSON.stringify([...done]));
  window.dispatchEvent(new CustomEvent("ptitsa-roadmap-progress"));
};

export const isRoadmapNodeDone = (nodeId: string): boolean =>
  readRoadmapDone().has(nodeId);
