import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { LessonExerciseStep } from "./lesson/LessonExerciseStep";
import { LessonIndexRedirect, LessonLayout } from "./lesson/LessonLayout";
import { LessonQuizStep } from "./lesson/LessonQuizStep";
import { LessonTheoryStep } from "./lesson/LessonTheoryStep";
import { CourseHomePage } from "./pages/CourseHomePage";
import { ExercisePage } from "./pages/ExercisePage";
import { HomePage } from "./pages/HomePage";
import { QuizPage } from "./pages/QuizPage";
import { QuizzesHomePage } from "./pages/QuizzesHomePage";

export const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<CourseHomePage />} />
      <Route path="learn" element={<CourseHomePage />} />
      <Route
        path="learn/:moduleSlug/:topicSlug/:lessonIndex"
        element={<LessonLayout />}
      >
        <Route index element={<LessonIndexRedirect />} />
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
