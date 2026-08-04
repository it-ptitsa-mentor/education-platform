import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  isLessonComplete,
  loadCourse,
  type Course,
  type Module,
  type Topic,
} from "../course";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import {
  findCatalogRoadmap,
  loadRoadmap,
  loadRoadmapCatalog,
  projectsForModule,
  roadmapNodePath,
  type Roadmap,
  type RoadmapCatalogEntry,
  type RoadmapModuleProject,
} from "../roadmap";

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

/** Первое предложение описания проекта — краткая подпись на карточке. */
const projectSummary = (description: string): string => {
  const firstPara = description.split(/\n\n+/)[0] ?? description;
  const firstSentence = firstPara.match(/^.*?[.!?](?=\s|$)/);
  return (firstSentence?.[0] ?? firstPara).trim();
};

const ProjectCard = ({
  roadmapId,
  project,
}: {
  roadmapId: string;
  project: RoadmapModuleProject;
}) => (
  <article className="course-project-card">
    <Link
      to={roadmapNodePath(roadmapId, project.id)}
      className="course-project-card-body"
    >
      <span className="course-project-card-kind">Проект</span>
      <h4 className="course-project-card-title">{project.node.label}</h4>
      {project.node.description && (
        <p className="course-project-card-desc">
          {projectSummary(project.node.description)}
        </p>
      )}
    </Link>
    {project.node.classroomUrl ? (
      <a
        href={project.node.classroomUrl}
        target="_blank"
        rel="noreferrer"
        className="course-project-card-classroom"
      >
        Открыть в Classroom →
      </a>
    ) : (
      <span
        className="course-project-card-classroom is-placeholder"
        aria-disabled="true"
      >
        Classroom скоро
      </span>
    )}
  </article>
);

const ModuleProjects = ({
  roadmapId,
  projects,
}: {
  roadmapId: string;
  projects: RoadmapModuleProject[];
}) => {
  if (!projects.length) return null;
  return (
    <div className="course-module-projects">
      <h4 className="course-module-projects-heading">
        {projects.length > 1 ? "Проекты модуля" : "Проект модуля"}
      </h4>
      <div className="course-module-projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} roadmapId={roadmapId} project={project} />
        ))}
      </div>
    </div>
  );
};

const ModuleBlock = ({
  mod,
  roadmap,
  roadmapId,
  onTopicClick,
}: {
  mod: Module;
  roadmap: Roadmap | null;
  roadmapId: string;
  onTopicClick: (sel: TopicSelection) => void;
}) => {
  const projects = roadmap ? projectsForModule(roadmap, mod.slug) : [];

  return (
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
      {/* Проекты модуля — в конце, после списка уроков/тем модуля. */}
      <ModuleProjects roadmapId={roadmapId} projects={projects} />
    </section>
  );
};

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
              roadmap={roadmap}
              roadmapId={roadmapId}
              onTopicClick={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="loading">
          <span className="spinner" aria-hidden />
        </div>
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
