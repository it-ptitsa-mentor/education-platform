import { Link, useParams } from "react-router-dom";
import { ExerciseRunner } from "../components/ExerciseRunner";

export const ExercisePage = () => {
  const { slug = "" } = useParams();

  if (!slug) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Задача не указана.{" "}
        <Link to="/" className="inline-link">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="exercise-page">
      <ExerciseRunner slug={slug} />
    </div>
  );
};
