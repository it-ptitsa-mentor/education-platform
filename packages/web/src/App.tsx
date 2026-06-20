import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ExercisePage } from "./pages/ExercisePage";
import { HomePage } from "./pages/HomePage";

export const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<HomePage />} />
      <Route path="exercise/:slug" element={<ExercisePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
