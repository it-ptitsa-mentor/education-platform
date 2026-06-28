import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  findCatalogProfession,
  loadRoadmapCatalog,
  roadmapPath,
  type ProfessionCatalogEntry,
  type RoadmapCatalogEntry,
} from "../roadmap";

const RoadmapCard = ({ roadmap }: { roadmap: RoadmapCatalogEntry }) => {
  const soon = roadmap.status === "soon";

  const inner = (
    <>
      <div className="roadmaps-card-head">
        <h3 className="roadmaps-card-title">{roadmap.title}</h3>
        {roadmap.badge && <span className="roadmaps-card-badge">{roadmap.badge}</span>}
      </div>
      <p className="roadmaps-card-sub">{roadmap.subtitle}</p>
      {soon && <span className="roadmaps-card-soon">Скоро на платформе</span>}
    </>
  );

  if (soon) {
    return <article className="roadmaps-card roadmaps-card--soon">{inner}</article>;
  }

  return (
    <Link to={roadmapPath(roadmap.id)} className="roadmaps-card roadmaps-card--active">
      {inner}
      <span className="roadmaps-card-cta">Открыть роадмап →</span>
    </Link>
  );
};

const ProfessionRoadmapsContent = ({
  profession,
}: {
  profession: ProfessionCatalogEntry;
}) => {
  const soon = profession.status === "soon" && profession.roadmaps.length === 0;

  return (
    <div className="home roadmaps-home">
      <div className="home-hero">
        <p className="home-kicker">Обучение</p>
        <h2 className="home-title">{profession.title}</h2>
        {profession.description && (
          <p className="home-lead">{profession.description}</p>
        )}
        <p className="roadmap-lead-extra">
          Выберите трек — внутри недели, темы и проекты. Урок: теория, квиз и практика на
          платформе.
        </p>
        <div className="roadmaps-hero-actions">
          <Link to="/" className="btn btn-secondary">
            ← Все направления
          </Link>
        </div>
      </div>

      <section className="roadmaps-profession">
        {soon && (
          <header className="roadmaps-profession-head">
            <span className="roadmaps-profession-soon">Скоро</span>
          </header>
        )}

        {profession.roadmaps.length > 0 ? (
          <div className="roadmaps-card-grid">
            {profession.roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        ) : (
          <div className="roadmaps-empty-profession">
            <p>Программа в разработке. Следите за обновлениями.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export const ProfessionRoadmapsPage = () => {
  const { professionId = "" } = useParams<{ professionId: string }>();
  const [profession, setProfession] = useState<ProfessionCatalogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!professionId) return;
    let cancelled = false;

    loadRoadmapCatalog()
      .then((catalog) => {
        if (cancelled) return;
        const hit = findCatalogProfession(catalog, professionId);
        if (!hit) {
          setNotFound(true);
          return;
        }
        setProfession(hit);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [professionId]);

  if (error) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-label">ERR</span> {error}
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="home roadmaps-home">
        <p className="banner banner-error">Направление не найдено.</p>
        <Link to="/" className="btn btn-secondary">
          ← К обучению
        </Link>
      </div>
    );
  }

  if (!profession) {
    return (
      <div className="loading">
        <span className="spinner spinner-lg" aria-hidden />
        <span className="loading-text">ЗАГРУЗКА</span>
      </div>
    );
  }

  return <ProfessionRoadmapsContent profession={profession} />;
};

/** @internal for tests */
export { ProfessionRoadmapsContent };
