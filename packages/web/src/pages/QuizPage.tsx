import { Link, useParams } from "react-router-dom";
import { QuizRunner } from "../components/QuizRunner";

export const QuizPage = () => {
  const { slug = "" } = useParams();

  if (!slug) {
    return (
      <div className="banner banner-error home-banner" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Квиз не указан.{" "}
        <Link to="/quizzes" className="inline-link">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <QuizRunner slug={slug} />
    </div>
  );
};
