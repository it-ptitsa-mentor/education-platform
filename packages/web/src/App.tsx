import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CourseHomePage } from "./pages/CourseHomePage";
import { LessonPage } from "./pages/LessonPage";
import { ExercisePage } from "./pages/ExercisePage";
import { HomePage } from "./pages/HomePage";
import { QuizPage } from "./pages/QuizPage";
import { QuizzesHomePage } from "./pages/QuizzesHomePage";

export const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<CourseHomePage />} />
      <Route
        path="learn/:moduleSlug/:topicSlug/:lessonIndex"
        element={<LessonPage />}
      />
      <Route path="learn" element={<CourseHomePage />} />
      <Route path="tasks" element={<HomePage />} />
      <Route path="quizzes" element={<QuizzesHomePage />} />
      <Route path="exercise/:slug" element={<ExercisePage />} />
      <Route path="quiz/:slug" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
