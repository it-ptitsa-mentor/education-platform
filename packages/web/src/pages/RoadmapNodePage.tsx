import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { filterRoadmapDisplayLinks } from "../lib/roadmap-course-link";
import {
  courseTopicLessonHref,
  getRoadmapNode,
  isRoadmapNodeDone,
  loadRoadmap,
  markRoadmapNodeDone,
  type Roadmap,
  type RoadmapNode,
} from "../roadmap";

export const RoadmapNodePage = () => {
  const { nodeId: rawId } = useParams<{ nodeId: string }>();
  const nodeId = rawId ? decodeURIComponent(rawId) : "";

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadRoadmap()
      .then(setRoadmap)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!nodeId) return;
    setDone(isRoadmapNodeDone(nodeId));
    const bump = () => setDone(isRoadmapNodeDone(nodeId));
    window.addEventListener("ptitsa-roadmap-progress", bump);
    return () => window.removeEventListener("ptitsa-roadmap-progress", bump);
  }, [nodeId]);

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

  const node: RoadmapNode | null = getRoadmapNode(roadmap, nodeId);

  if (!node)
    return (
      <div className="roadmap-node-page">
        <p className="banner banner-error">Шаг роадмапа не найден.</p>
        <Link to="/" className="btn btn-secondary">
          ← К роадмапу
        </Link>
      </div>
    );

  const lessonHref = node.courseTopic
    ? courseTopicLessonHref(node.courseTopic)
    : null;
  const displayLinks = filterRoadmapDisplayLinks(node.links);

  return (
    <article className="roadmap-node-page">
      <nav className="roadmap-node-crumb" aria-label="Навигация">
        <Link to="/">Роадмап</Link>
        <span aria-hidden> / </span>
        <span>{node.label}</span>
      </nav>

      <header className="roadmap-node-head">
        <span className={`roadmap-node-kind roadmap-node-kind--${node.kind}`}>
          {node.kind === "project" ? "Проект" : "Тема"}
        </span>
        <h1 className="roadmap-node-title">{node.label}</h1>
        {done && <p className="roadmap-node-done-label">Отмечено как пройдено</p>}
      </header>

      {node.description && (
        <div className="roadmap-node-desc">
          {node.description.split(/\n\n+/).map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>
      )}

      <div className="roadmap-node-actions">
        {lessonHref && (
          <Link to={lessonHref} className="btn btn-primary">
            К урокам на платформе
          </Link>
        )}
        {node.classroomUrl && (
          <a
            href={node.classroomUrl}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            Открыть в Classroom
          </a>
        )}
        {!done && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => markRoadmapNodeDone(nodeId)}
          >
            Отметить пройденным
          </button>
        )}
        <Link to="/" className="btn btn-ghost">
          ← Назад к роадмапу
        </Link>
      </div>

      {displayLinks.length > 0 && (
        <section className="roadmap-node-links">
          <h2>{lessonHref ? "Дополнительные материалы" : "Материалы"}</h2>
          <ul>
            {displayLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  <span className="roadmap-link-type">{link.type}</span>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};
