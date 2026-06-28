import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  courseTopicLessonHref,
  findCatalogRoadmap,
  isRoadmapNodeDone,
  loadRoadmap,
  loadRoadmapCatalog,
  professionPath,
  roadmapNodePath,
  roadmapPath,
  type Roadmap,
  type RoadmapCatalogEntry,
  type RoadmapNode,
  type RoadmapPhase,
  type RoadmapWeek,
} from "../roadmap";

const roadmapNodeHref = (roadmapId: string, nodeId: string, node: RoadmapNode) => {
  if (node.courseTopic) return courseTopicLessonHref(node.courseTopic);
  if (node.kind === "project" && node.classroomUrl) return node.classroomUrl;
  return roadmapNodePath(roadmapId, nodeId);
};

const NodePill = ({
  roadmapId,
  nodeId,
  node,
  done,
}: {
  roadmapId: string;
  nodeId: string;
  node: RoadmapNode;
  done: boolean;
}) => {
  const href = roadmapNodeHref(roadmapId, nodeId, node);
  const external = href.startsWith("http");

  const className = `roadmap-node-pill roadmap-node-pill--${node.kind}${done ? " is-done" : ""}`;

  const inner = (
    <>
      <span className="roadmap-node-pill-main">
        <span className="roadmap-node-pill-kind">
          {node.kind === "project" ? "Проект" : "Тема"}
        </span>
        <span className="roadmap-node-pill-label">{node.label}</span>
      </span>
      {done && <span className="roadmap-node-pill-done" aria-label="пройдено" />}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {inner}
    </Link>
  );
};

const WeekBlock = ({
  roadmapId,
  week,
  nodes,
  doneSet,
}: {
  roadmapId: string;
  week: RoadmapWeek;
  nodes: Roadmap["nodes"];
  doneSet: Set<string>;
}) => {
  const ids = [...week.topicIds, ...week.projectIds];
  if (!ids.length) return null;

  return (
    <div className="roadmap-week">
      <h4 className="roadmap-week-title">Неделя {week.week}</h4>
      <div className="roadmap-week-nodes">
        {ids.map((id) => {
          const node = nodes[id];
          if (!node) return null;
          return (
            <NodePill
              key={id}
              roadmapId={roadmapId}
              nodeId={id}
              node={node}
              done={doneSet.has(id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const PhaseSection = ({
  roadmapId,
  phase,
  nodes,
  doneSet,
  defaultOpen,
}: {
  roadmapId: string;
  phase: RoadmapPhase;
  nodes: Roadmap["nodes"];
  doneSet: Set<string>;
  defaultOpen: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const weekCount = phase.weeks.length;
  const nodeCount = phase.weeks.reduce(
    (s, w) => s + w.topicIds.length + w.projectIds.length,
    0,
  );

  return (
    <section className="roadmap-phase">
      <button
        type="button"
        className="roadmap-phase-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="roadmap-phase-num">{phase.id.toUpperCase()}</span>
        <span className="roadmap-phase-label">{phase.label}</span>
        <span className="roadmap-phase-meta">
          {weekCount} нед. · {nodeCount} шагов
        </span>
        <span className="roadmap-phase-chevron" aria-hidden />
      </button>
      {open && (
        <div className="roadmap-phase-body">
          {phase.weeks.map((w) => (
            <WeekBlock
              key={w.week}
              roadmapId={roadmapId}
              week={w}
              nodes={nodes}
              doneSet={doneSet}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const RoadmapComingSoon = ({
  entry,
  professionTitle,
  professionId,
}: {
  entry: RoadmapCatalogEntry;
  professionTitle: string;
  professionId: string;
}) => (
  <div className="home roadmap-home roadmaps-soon-page">
    <div className="home-hero">
      <p className="home-kicker">{professionTitle}</p>
      <h2 className="home-title">{entry.title}</h2>
      <p className="home-lead">{entry.subtitle}</p>
      <p className="roadmap-lead-extra">
        Этот трек ещё переносится на платформу. Пока доступен{" "}
        <Link to={roadmapPath("frontend-bootcamp")}>Frontend Bootcamp</Link>.
      </p>
      <div className="roadmap-hero-actions">
        <Link to={professionPath(professionId)} className="btn btn-secondary">
          ← Роадмапы направления
        </Link>
        <Link to="/" className="btn btn-ghost">
          К обучению
        </Link>
      </div>
    </div>
  </div>
);

export const RoadmapPage = () => {
  const { roadmapId = "" } = useParams<{ roadmapId: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [catalogEntry, setCatalogEntry] = useState<{
    professionId: string;
    professionTitle: string;
    roadmap: RoadmapCatalogEntry;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);

  useEffect(() => {
    if (!roadmapId) return;
    let cancelled = false;

    loadRoadmapCatalog()
      .then((catalog) => {
        if (cancelled) return;
        const hit = findCatalogRoadmap(catalog, roadmapId);
        if (hit) {
          setCatalogEntry({
            professionId: hit.profession.id,
            professionTitle: hit.profession.title,
            roadmap: hit.roadmap,
          });
          if (hit.roadmap.status === "soon") return;
        }
        return loadRoadmap(roadmapId).then((data) => {
          if (!cancelled) setRoadmap(data);
        });
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [roadmapId]);

  useEffect(() => {
    const bump = () => setProgressVersion((v) => v + 1);
    window.addEventListener("ptitsa-roadmap-progress", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("ptitsa-roadmap-progress", bump);
      window.removeEventListener("focus", bump);
    };
  }, []);

  const doneSet = useMemo(() => {
    void progressVersion;
    if (!roadmap) return new Set<string>();
    const ids = Object.keys(roadmap.nodes);
    return new Set(ids.filter((id) => isRoadmapNodeDone(id)));
  }, [roadmap, progressVersion]);

  const stats = useMemo(() => {
    if (!roadmap) return { total: 0, done: 0, onPlatform: 0 };
    const ids = Object.keys(roadmap.nodes);
    return {
      total: ids.length,
      done: doneSet.size,
      onPlatform: ids.filter((id) => roadmap.nodes[id]?.courseTopic).length,
    };
  }, [roadmap, doneSet]);

  if (catalogEntry?.roadmap.status === "soon") {
    return (
      <RoadmapComingSoon
        entry={catalogEntry.roadmap}
        professionTitle={catalogEntry.professionTitle}
        professionId={catalogEntry.professionId}
      />
    );
  }

  if (error)
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-label">ERR</span> {error}
      </div>
    );

  if (!roadmap)
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА РОАДМАПА</span>
      </div>
    );

  return (
    <div className="home roadmap-home">
      <div className="home-hero">
        <div className="roadmap-hero-main">
          <p className="home-kicker">{roadmap.profession}</p>
          <h2 className="home-title">{roadmap.title}</h2>
          <p className="home-lead">{roadmap.subtitle}</p>
          <p className="roadmap-lead-extra">
            Нажмите на тему — откроется урок: теория, ниже квиз, затем практика.
            Проекты ведут в GitHub Classroom.
          </p>
        </div>
        <div className="roadmap-hero-side">
          <div className="course-meta">
            <span>
              <b>{stats.total}</b> шагов
            </span>
            <span>
              <b>{stats.onPlatform}</b> на платформе
            </span>
            <span>
              <b>{stats.done}</b> отмечено
            </span>
          </div>
          <div className="roadmap-hero-actions">
            {catalogEntry && (
              <Link to={professionPath(catalogEntry.professionId)} className="btn btn-secondary">
                ← Роадмапы направления
              </Link>
            )}
            <Link to="/" className="btn btn-ghost">
              К обучению
            </Link>
          </div>
        </div>
      </div>

      <div className="roadmap-phases">
        {roadmap.phases.map((phase, i) => (
          <PhaseSection
            key={phase.id}
            roadmapId={roadmapId}
            phase={phase}
            nodes={roadmap.nodes}
            doneSet={doneSet}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
};
