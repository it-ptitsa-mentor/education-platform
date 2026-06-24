/**
 * Экспорт роадмапа Frontend Bootcamp из соседнего репо roadmap → content/roadmap/.
 * SSOT: roadmap/src/topics.prod.ts + curriculum/react-phase-16w.ts
 *
 * Запуск: pnpm export:roadmap-content
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const roadmapRoot = resolve(root, "..", "roadmap");

type Link = { type: string; title: string; url: string };

type TopicEntry = {
  kind: "topic";
  label: string;
  description: string;
  links: Link[];
};

type ProjectEntry = {
  kind: "project";
  label: string;
  classroomUrl: string;
  description?: string;
};

type RoadmapNode = {
  kind: "topic" | "project";
  label: string;
  description: string;
  links: Link[];
  classroomUrl?: string;
  courseTopic: { moduleSlug: string; topicSlug: string; title: string } | null;
};

type HexletTopicRef = {
  moduleSlug: string;
  topicSlug: string;
  title: string;
};

const BUILDIN_UUID =
  /buildin\.ai(?:\/[^/]+)?\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

const isBuildinCourseLink = (link: Link): boolean =>
  link.type === "course" && /buildin\.ai/i.test(link.url);

const filterDisplayLinks = (links: Link[]): Link[] =>
  links.filter((link) => !isBuildinCourseLink(link));

const extractBuildinTopicId = (links: Link[]): string | null => {
  for (const link of links) {
    if (link.type !== "course") continue;
    const m = link.url.match(BUILDIN_UUID);
    if (m) return m[1].toLowerCase();
  }
  return null;
};

const buildHexletTopicIndex = (
  manifest: {
    modules: Array<{
      slug: string;
      topics: Array<{ id?: string; slug: string; title: string }>;
    }>;
  },
): { byId: Map<string, HexletTopicRef>; byTitle: Map<string, HexletTopicRef> } => {
  const byId = new Map<string, HexletTopicRef>();
  const byTitle = new Map<string, HexletTopicRef>();
  for (const mod of manifest.modules) {
    for (const topic of mod.topics) {
      const ref: HexletTopicRef = {
        moduleSlug: mod.slug,
        topicSlug: topic.slug,
        title: topic.title,
      };
      if (topic.id) byId.set(topic.id.toLowerCase(), ref);
      byTitle.set(topic.title.trim().toLowerCase(), ref);
    }
  }
  return { byId, byTitle };
};

const resolveCourseTopic = (
  entry: TopicEntry,
  index: ReturnType<typeof buildHexletTopicIndex>,
): HexletTopicRef | null => {
  const buildinId = extractBuildinTopicId(entry.links);
  if (buildinId) {
    const hit = index.byId.get(buildinId);
    if (hit) return hit;
  }
  return index.byTitle.get(entry.label.trim().toLowerCase()) ?? null;
};

const main = async () => {
  const topicsProd = await import(
    pathToFileURL(resolve(roadmapRoot, "src/topics.prod.ts")).href
  );
  const curriculum = await import(
    pathToFileURL(resolve(roadmapRoot, "src/curriculum/react-phase-16w.ts")).href
  );

  const manifest = JSON.parse(
    readFileSync(resolve(root, "content/theory/manifest.json"), "utf8"),
  ) as Parameters<typeof buildHexletTopicIndex>[0];

  const hexletIndex = buildHexletTopicIndex(manifest);
  const nodes: Record<string, RoadmapNode> = {};

  for (const [id, raw] of Object.entries(topicsProd.topicsProd as Record<string, TopicEntry | ProjectEntry>)) {
    if (raw.kind === "topic") {
      nodes[id] = {
        kind: "topic",
        label: raw.label,
        description: raw.description,
        links: filterDisplayLinks(raw.links),
        courseTopic: resolveCourseTopic(raw, hexletIndex),
      };
    } else if (raw.kind === "project") {
      nodes[id] = {
        kind: "project",
        label: raw.label,
        description: raw.description ?? "",
        links: [],
        classroomUrl: raw.classroomUrl,
        courseTopic: null,
      };
    }
  }

  const payload = {
    id: "frontend-bootcamp",
    title: "Frontend Bootcamp",
    subtitle: "16 недель · CLI и JS → Web/DOM → React",
    profession: "Frontend-разработчик",
    phases: curriculum.TEST_16W_PHASES,
  };

  const outDir = resolve(root, "content", "roadmap");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "frontend-bootcamp.json"),
    JSON.stringify({ ...payload, nodes }, null, 2),
    "utf8",
  );

  const mapped = Object.values(nodes).filter((n) => n.courseTopic).length;
  console.log(`✓ content/roadmap/frontend-bootcamp.json (${Object.keys(nodes).length} нод, ${mapped} с уроками на платформе)`);
};

main().catch((err) => {
  console.error("✗ export roadmap:", err);
  process.exit(1);
});
