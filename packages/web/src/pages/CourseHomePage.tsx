import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  loadRoadmapCatalog,
  professionPath,
  roadmapPath,
  type ProfessionCatalogEntry,
  type RoadmapCatalogEntry,
} from "../roadmap";
import { getCurrentTrack } from "../track";

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

const ProfessionContent = ({ profession }: { profession: ProfessionCatalogEntry }) => {
  if (profession.roadmaps.length === 0) {
    return (
      <div className="home course-home roadmaps-home">
        <div className="home-hero">
          <p className="home-kicker">Обучение</p>
          <h2 className="home-title">{profession.title}</h2>
          {profession.description && (
            <p className="home-lead">{profession.description}</p>
          )}
        </div>
        <div className="roadmaps-empty-profession">
          <p>Программа в разработке. Следите за обновлениями.</p>
        </div>
      </div>
    );
  }

  const activeRoadmaps = profession.roadmaps.filter((r) => r.status === "active");

  return (
    <div className="home course-home roadmaps-home">
      <div className="home-hero">
        <p className="home-kicker">Обучение</p>
        <h2 className="home-title">{profession.title}</h2>
        {profession.description && (
          <p className="home-lead">{profession.description}</p>
        )}
        {activeRoadmaps.length > 1 && (
          <p className="roadmap-lead-extra">
            Выберите трек — внутри недели, темы и проекты. В каждом уроке: теория, квиз и
            практика.
          </p>
        )}
        {activeRoadmaps.length > 1 && (
          <div className="roadmaps-hero-actions">
            <Link to={professionPath(profession.id)} className="btn btn-secondary">
              Все треки →
            </Link>
          </div>
        )}
      </div>
      <div className="roadmaps-card-grid">
        {profession.roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </div>
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

  // Показываем ТОЛЬКО программу текущего трека — без UI-выбора профессии.
  // Источник трека: getCurrentTrack() (сейчас: URL ?track= / localStorage,
  // позже — профиль из ЛК; менять только в track.ts).
  const track = getCurrentTrack();
  const currentProfession = professions.find((p) => p.id === track) ?? null;

  if (!currentProfession) {
    return (
      <div className="home course-home roadmaps-home">
        <div className="home-hero">
          <p className="home-kicker">Обучение</p>
          <h2 className="home-title">Программа в разработке</h2>
          <p className="home-lead">Для вашего трека программа появится скоро.</p>
        </div>
      </div>
    );
  }

  return <ProfessionContent profession={currentProfession} />;
};
