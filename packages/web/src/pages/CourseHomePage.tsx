import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  loadRoadmapCatalog,
  professionPath,
  type ProfessionCatalogEntry,
} from "../roadmap";

const ProfessionCard = ({ profession }: { profession: ProfessionCatalogEntry }) => {
  const soon = profession.status === "soon" && profession.roadmaps.length === 0;
  const activeCount = profession.roadmaps.filter((r) => r.status === "active").length;

  const inner = (
    <>
      <div className="roadmaps-card-head">
        <h3 className="roadmaps-card-title">{profession.title}</h3>
        {soon ? (
          <span className="roadmaps-card-badge">Скоро</span>
        ) : (
          activeCount > 0 && (
            <span className="roadmaps-card-badge">
              {profession.roadmaps.length} трек
              {profession.roadmaps.length === 1 ? "" : "а"}
            </span>
          )
        )}
      </div>
      {profession.description && (
        <p className="roadmaps-card-sub">{profession.description}</p>
      )}
      {soon && <span className="roadmaps-card-soon">Скоро на платформе</span>}
    </>
  );

  if (soon) {
    return <article className="roadmaps-card roadmaps-card--soon">{inner}</article>;
  }

  return (
    <Link
      to={professionPath(profession.id)}
      className="roadmaps-card roadmaps-card--active"
    >
      {inner}
      <span className="roadmaps-card-cta">Роадмапы →</span>
    </Link>
  );
};

export const CourseHomePage = () => {
  const [professions, setProfessions] = useState<ProfessionCatalogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoadmapCatalog()
      .then((catalog) => setProfessions(catalog.professions))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  }

  if (!professions) {
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );
  }

  return (
    <div className="home course-home roadmaps-home">
      <div className="home-hero">
        <p className="home-kicker">Обучение</p>
        <h2 className="home-title">Выберите направление</h2>
        <p className="home-lead">
          JS или Go — дальше роадмап с модулями и уроками. В каждом уроке: теория, квиз и
          практика.
        </p>
      </div>

      <div className="roadmaps-card-grid">
        {professions.map((profession) => (
          <ProfessionCard key={profession.id} profession={profession} />
        ))}
      </div>
    </div>
  );
};
