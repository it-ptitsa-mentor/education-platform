/** Модель роадмапа + загрузчик JSON (SSOT: content/roadmap/). */

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
  phaseId: "p1" | "p2" | "p3";
  topicIds: string[];
  projectIds: string[];
};

export type RoadmapPhase = {
  id: "p1" | "p2" | "p3";
  label: string;
  weeks: RoadmapWeek[];
};

export type Roadmap = {
  id: string;
  title: string;
  subtitle: string;
  profession: string;
  phases: RoadmapPhase[];
  nodes: Record<string, RoadmapNode>;
};

const base = import.meta.env.BASE_URL;
const ROADMAP_ID = "frontend-bootcamp";

let cache: Roadmap | null = null;

export const loadRoadmap = async (): Promise<Roadmap> => {
  if (cache) return cache;
  const res = await fetch(`${base}roadmap/${ROADMAP_ID}.json`);
  if (!res.ok) throw new Error("Не удалось загрузить роадмап");
  cache = (await res.json()) as Roadmap;
  return cache;
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
