import { Navigate, useParams } from "react-router-dom";
import { topicEntryPath } from "../lib/lesson-units";

/** Тема без номера урока → первый урок, шаг «Теория». */
export const LessonTopicRedirect = () => {
  const { moduleSlug = "", topicSlug = "" } = useParams();
  return <Navigate to={topicEntryPath(moduleSlug, topicSlug)} replace />;
};
