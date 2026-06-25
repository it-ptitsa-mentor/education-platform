import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { LessonExerciseStep } from "./lesson/LessonExerciseStep";
import { LessonLayout } from "./lesson/LessonLayout";
import { LessonQuizStep } from "./lesson/LessonQuizStep";
import { LessonTheoryStep } from "./lesson/LessonTheoryStep";
import { LessonTopicRedirect } from "./lesson/LessonTopicRedirect";
import { CourseHomePage } from "./pages/CourseHomePage";
import { ExercisePage } from "./pages/ExercisePage";
import { HomePage } from "./pages/HomePage";
import { QuizPage } from "./pages/QuizPage";
import { QuizzesHomePage } from "./pages/QuizzesHomePage";
import { RoadmapNodePage } from "./pages/RoadmapNodePage";
import { RoadmapPage } from "./pages/RoadmapPage";

export const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<RoadmapPage />} />
      <Route path="roadmap" element={<RoadmapPage />} />
      <Route path="roadmap/:nodeId" element={<RoadmapNodePage />} />
      <Route path="learn" element={<CourseHomePage />} />
      <Route
        path="learn/:moduleSlug/:topicSlug"
        element={<LessonTopicRedirect />}
      />
      <Route
        path="learn/:moduleSlug/:topicSlug/:lessonIndex"
        element={<LessonLayout />}
      >
        <Route index element={<Navigate to="theory" replace />} />
        <Route path="theory" element={<LessonTheoryStep />} />
        <Route path="quiz" element={<LessonQuizStep />} />
        <Route path="exercise" element={<LessonExerciseStep />} />
        <Route path="*" element={<Navigate to="theory" replace />} />
      </Route>
      <Route path="tasks" element={<HomePage />} />
      <Route path="quizzes" element={<QuizzesHomePage />} />
      <Route path="exercise/:slug" element={<ExercisePage />} />
      <Route path="quiz/:slug" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
