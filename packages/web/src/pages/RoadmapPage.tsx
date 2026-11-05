import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  isLessonComplete,
  loadCourse,
  type Course,
  type Module,
  type Topic,
} from "../course";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import { rememberLessonOrigin } from "../lib/lesson-origin";
import {
  findCatalogRoadmap,
  loadRoadmap,
  loadRoadmapCatalog,
  type Roadmap,
  type RoadmapNode,
  type RoadmapCatalogEntry,
} from "../roadmap";

const weekProjects = (roadmap: Roadmap, week: number): RoadmapNode[] =>
  roadmap.phases.flatMap((phase) => phase.weeks)
    .filter((item) => item.week === week)
    .flatMap((item) => item.projectIds)
    .map((id) => roadmap.nodes[id])
    .filter((node): node is RoadmapNode => node?.kind === "project");

const ProjectCards = ({ projects, week }: { projects: RoadmapNode[]; week: number }) => (
  <div className="roadmap-projects-row">
    {projects.map((project, index) => (
      <div className="project-card" key={`${week}-${index}`}>
        <div className="project-card-header">
          <span className="project-card-label">Проект W{week}</span>
          <h4 className="project-card-name">{project.label}</h4>
        </div>
        <p className="project-card-desc">{project.description}</p>
        {project.classroomUrl && (
          <a href={project.classroomUrl} target="_blank" rel="noopener noreferrer" className="project-card-link">
            Открыть задание →
          </a>
        )}
      </div>
    ))}
  </div>
);

type TopicSelection = { module: Module; topic: Topic };

const TopicDot = ({
  topic,
  moduleSlug,
}: {
  topic: Topic;
  moduleSlug: string;
}) => {
  const total = topic.lessons.length;
  const done = topic.lessons.filter((l) => {
    const id = `${moduleSlug}/${topic.slug}/${l.index}`;
    return isLessonComplete(l, id);
  }).length;
  const pct = total > 0 ? done / total : 0;

  if (pct === 1)
    return <span className="course-topic-dot is-full" title="пройдено" />;
  if (pct > 0)
    return <span className="course-topic-dot is-partial" title={`${done}/${total}`} />;
  return <span className="course-topic-dot" />;
};

const ModuleBlock = ({
  mod,
  projects,
  onTopicClick,
}: {
  mod: Module;
  projects: RoadmapNode[];
  onTopicClick: (sel: TopicSelection) => void;
}) => (
  <section className="course-module-block">
    <h3 className="course-module-block-heading">Темы модуля #{mod.index}</h3>
    <div className="course-module-topics-grid">
      {mod.topics.map((topic) => (
        <button
          key={topic.slug}
          type="button"
          className="course-topic-btn"
          onClick={() => onTopicClick({ module: mod, topic })}
        >
          <span className="course-topic-btn-name">{topic.title}</span>
          <TopicDot topic={topic} moduleSlug={mod.slug} />
        </button>
      ))}
    </div>
    {projects.length > 0 && <ProjectCards projects={projects} week={mod.index} />}
  </section>
);

const RoadmapComingSoon = ({
  entry,
}: {
  entry: RoadmapCatalogEntry;
}) => (
  <div className="home roadmap-home">
    <div className="home-hero">
      <h2 className="home-title">{entry.title}</h2>
      <p className="home-lead">{entry.subtitle}</p>
      <p className="roadmap-lead-extra">Этот трек скоро появится на платформе.</p>
    </div>
  </div>
);

export const RoadmapPage = () => {
  const { roadmapId = "" } = useParams<{ roadmapId: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [catalogEntry, setCatalogEntry] = useState<{
    roadmap: RoadmapCatalogEntry;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [selected, setSelected] = useState<TopicSelection | null>(null);

  useEffect(() => {
    if (!roadmapId) return;
    let cancelled = false;

    loadRoadmapCatalog()
      .then((catalog) => {
        if (cancelled) return;
        const hit = findCatalogRoadmap(catalog, roadmapId);
        if (hit) setCatalogEntry({ roadmap: hit.roadmap });
        if (hit?.roadmap.status === "soon") return;
        return loadRoadmap(roadmapId).then((data) => {
          if (!cancelled) setRoadmap(data);
        });
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message); });

    return () => { cancelled = true; };
  }, [roadmapId]);

  useEffect(() => {
    loadCourse().then(setCourse).catch(() => {});
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

  const stats = useMemo(() => {
    if (!course) return { total: 0, done: 0 };
    void progressVersion;
    let total = 0, done = 0;
    for (const mod of course.modules)
      for (const topic of mod.topics)
        for (const lesson of topic.lessons) {
          total++;
          if (isLessonComplete(lesson, `${mod.slug}/${topic.slug}/${lesson.index}`)) done++;
        }
    return { total, done };
  }, [course, progressVersion]);

  if (catalogEntry?.roadmap.status === "soon") {
    return <RoadmapComingSoon entry={catalogEntry.roadmap} />;
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
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );

  return (
    <div className="home roadmap-home">
      <div className="home-hero roadmap-hero-compact">
        <div className="roadmap-hero-main">
          <p className="home-kicker">{roadmap.profession}</p>
          <h2 className="home-title">Программа обучения</h2>
        </div>
        <div className="roadmap-hero-side">
          <div className="course-meta">
            <span><b>{stats.total}</b> уроков</span>
            <span><b>{stats.done}</b> пройдено</span>
          </div>
        </div>
      </div>

      {course ? (
        <div className="course-modules-program">
          {course.modules.map((mod) => (
            <ModuleBlock
              key={mod.slug}
              mod={mod}
              projects={weekProjects(roadmap, mod.index)}
              onTopicClick={(sel) => {
                // Запоминаем курс входа, чтобы выход из урока вёл сюда.
                rememberLessonOrigin({ roadmapId });
                setSelected(sel);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="loading">
          <span className="spinner" aria-hidden />
        </div>
      )}

      {roadmap.phases.some((phase) => phase.weeks.some((week) =>
        week.week >= 7 && week.week <= 16 && weekProjects(roadmap, week.week).length > 0,
      )) && (
        <section className="roadmap-react-projects" aria-labelledby="react-projects-heading">
          <h3 id="react-projects-heading" className="course-module-block-heading">Проекты React-фазы</h3>
          {Array.from({ length: 10 }, (_, index) => index + 7).map((week) => {
            const projects = weekProjects(roadmap, week);
            return projects.length > 0 ? <ProjectCards key={week} projects={projects} week={week} /> : null;
          })}
        </section>
      )}

      {selected && (
        <TopicLessonsModal
          module={selected.module}
          topic={selected.topic}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
