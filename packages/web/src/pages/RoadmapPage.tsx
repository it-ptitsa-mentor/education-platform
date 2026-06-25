import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  courseTopicLessonHref,
  isRoadmapNodeDone,
  loadRoadmap,
  type Roadmap,
  type RoadmapNode,
  type RoadmapPhase,
  type RoadmapWeek,
} from "../roadmap";

const roadmapNodeHref = (nodeId: string, node: RoadmapNode) => {
  if (node.courseTopic) return courseTopicLessonHref(node.courseTopic);
  if (node.kind === "project" && node.classroomUrl) return node.classroomUrl;
  return `/roadmap/${encodeURIComponent(nodeId)}`;
};

const NodePill = ({
  nodeId,
  node,
  done,
}: {
  nodeId: string;
  node: RoadmapNode;
  done: boolean;
}) => {
  const href = roadmapNodeHref(nodeId, node);
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
  week,
  nodes,
  doneSet,
}: {
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
  phase,
  nodes,
  doneSet,
  defaultOpen,
}: {
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
            <WeekBlock key={w.week} week={w} nodes={nodes} doneSet={doneSet} />
          ))}
        </div>
      )}
    </section>
  );
};

export const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);

  useEffect(() => {
    loadRoadmap()
      .then(setRoadmap)
      .catch((e: Error) => setError(e.message));
  }, []);

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
            <Link to="/learn" className="btn btn-secondary">
              Каталог курса
            </Link>
          </div>
        </div>
      </div>

      <div className="roadmap-phases">
        {roadmap.phases.map((phase, i) => (
          <PhaseSection
            key={phase.id}
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
