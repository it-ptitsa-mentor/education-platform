/** Сопоставление Buildin course-link → тема Hexlet в manifest. */

export type HexletTopicRef = {
  moduleSlug: string;
  topicSlug: string;
  title: string;
};

export type ManifestTopic = {
  id?: string;
  slug: string;
  title: string;
};

export type TheoryManifest = {
  modules: Array<{
    slug: string;
    topics: ManifestTopic[];
  }>;
};

const BUILDIN_UUID =
  /buildin\.ai(?:\/[^/]+)?\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

export type RoadmapLinkLike = { type: string; url: string };

/** Курс на Buildin — теория уже на платформе, в UI не показываем. */
export const isBuildinCourseLink = (link: RoadmapLinkLike): boolean =>
  link.type === "course" && /buildin\.ai/i.test(link.url);

export const filterRoadmapDisplayLinks = <T extends RoadmapLinkLike>(
  links: T[],
): T[] => links.filter((link) => !isBuildinCourseLink(link));

export const extractBuildinTopicId = (url: string): string | null => {
  const m = url.match(BUILDIN_UUID);
  return m ? m[1].toLowerCase() : null;
};

export const buildHexletTopicIndex = (
  manifest: TheoryManifest,
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

export const resolveCourseTopicByBuildinId = (
  buildinId: string,
  index: ReturnType<typeof buildHexletTopicIndex>,
): HexletTopicRef | null => index.byId.get(buildinId.toLowerCase()) ?? null;

export const resolveCourseTopicByTitle = (
  title: string,
  index: ReturnType<typeof buildHexletTopicIndex>,
): HexletTopicRef | null => index.byTitle.get(title.trim().toLowerCase()) ?? null;
