/**
 * Экспорт роадмапов из соседнего репо roadmap → content/roadmap/.
 * SSOT: roadmap/src/topics.*.ts + curriculum/*-phases.ts
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

type RoadmapExportSpec = {
  filename: string;
  id: string;
  title: string;
  subtitle: string;
  profession: string;
  topicsModule: string;
  topicsExport: string;
  phasesModule: string;
  phasesExport: string;
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

const buildNodes = (
  topics: Record<string, TopicEntry | ProjectEntry>,
  hexletIndex: ReturnType<typeof buildHexletTopicIndex>,
): Record<string, RoadmapNode> => {
  const nodes: Record<string, RoadmapNode> = {};
  for (const [id, raw] of Object.entries(topics)) {
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
  return nodes;
};

const ROADMAPS: RoadmapExportSpec[] = [
  {
    filename: "frontend-bootcamp.json",
    id: "frontend-bootcamp",
    title: "Frontend Bootcamp",
    subtitle: "16 недель · CLI и JS → Web/DOM → React",
    profession: "Frontend-разработчик",
    topicsModule: "src/topics.prod.ts",
    topicsExport: "topicsProd",
    phasesModule: "src/curriculum/react-phase-16w.ts",
    phasesExport: "TEST_16W_PHASES",
  },
  {
    filename: "react-first.json",
    id: "react-first",
    title: "React First",
    subtitle: "20 недель · React с первой недели, spiral-подход",
    profession: "Frontend-разработчик",
    topicsModule: "src/topics.react-first.ts",
    topicsExport: "topics",
    phasesModule: "src/curriculum/react-first-phases.ts",
    phasesExport: "REACT_FIRST_PHASES",
  },
];

const main = async () => {
  const manifest = JSON.parse(
    readFileSync(resolve(root, "content/theory/manifest.json"), "utf8"),
  ) as Parameters<typeof buildHexletTopicIndex>[0];

  const hexletIndex = buildHexletTopicIndex(manifest);
  const outDir = resolve(root, "content", "roadmap");
  mkdirSync(outDir, { recursive: true });

  for (const spec of ROADMAPS) {
    const topicsMod = await import(
      pathToFileURL(resolve(roadmapRoot, spec.topicsModule)).href
    );
    const phasesMod = await import(
      pathToFileURL(resolve(roadmapRoot, spec.phasesModule)).href
    );

    const topics = topicsMod[spec.topicsExport] as Record<
      string,
      TopicEntry | ProjectEntry
    >;
    const phases = phasesMod[spec.phasesExport];

    const nodes = buildNodes(topics, hexletIndex);
    const payload = {
      id: spec.id,
      title: spec.title,
      subtitle: spec.subtitle,
      profession: spec.profession,
      phases,
    };

    writeFileSync(
      resolve(outDir, spec.filename),
      JSON.stringify({ ...payload, nodes }, null, 2),
      "utf8",
    );

    const mapped = Object.values(nodes).filter((n) => n.courseTopic).length;
    console.log(
      `✓ content/roadmap/${spec.filename} (${Object.keys(nodes).length} нод, ${mapped} с уроками на платформе)`,
    );
  }
};

main().catch((err) => {
  console.error("✗ export roadmap:", err);
  process.exit(1);
});
