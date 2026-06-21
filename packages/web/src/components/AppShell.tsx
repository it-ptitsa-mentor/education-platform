import { Link, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

export const AppShell = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="app-grain" aria-hidden />
      <div className="app-grid" aria-hidden />

      <header className="topbar">
        <Link to="/" className="brand brand-link">
          <span className="brand-mark" aria-hidden>
            <span className="brand-dot" />
            <span className="brand-ring" />
          </span>
          <div>
            <p className="brand-eyebrow">SYS · TRAINER · v0.1</p>
            <h1>IT Птица</h1>
          </div>
        </Link>

        <nav className="topbar-nav" aria-label="Разделы платформы">
          <Link
            to="/"
            className={`topbar-nav-link${location.pathname === "/" || location.pathname.startsWith("/exercise/") ? " is-active" : ""}`}
          >
            Задачи
          </Link>
          <Link
            to="/quizzes"
            className={`topbar-nav-link${location.pathname.startsWith("/quiz") ? " is-active" : ""}`}
          >
            Квизы
          </Link>
        </nav>

        <div className="topbar-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
};