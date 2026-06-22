import { Link, Outlet, useLocation } from "react-router-dom";
import { brandLogoUrl } from "../lib/brand-assets";
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
        <Link to="/" className="brand brand-link" aria-label="IT Птица — каталог">
          <img
            className="brand-logo"
            src={brandLogoUrl}
            width={40}
            height={40}
            alt=""
            aria-hidden
          />
          <span className="brand-word">
            IT&nbsp;Птица
            <span className="brand-chip">EDU</span>
          </span>
        </Link>

        <nav className="topbar-nav" aria-label="Разделы платформы">
          <Link
            to="/"
            className={`topbar-nav-link${location.pathname === "/" || location.pathname.startsWith("/learn") ? " is-active" : ""}`}
          >
            Курс
          </Link>
          <Link
            to="/tasks"
            className={`topbar-nav-link${location.pathname.startsWith("/tasks") || location.pathname.startsWith("/exercise/") ? " is-active" : ""}`}
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