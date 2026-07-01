import { Link, Outlet, useLocation } from "react-router-dom";
import { brandLogoUrl } from "../lib/brand-assets";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const isLearningRoute = (pathname: string) =>
  pathname === "/" ||
  pathname.startsWith("/professions/") ||
  pathname.startsWith("/roadmaps/") ||
  pathname.startsWith("/learn/");

export const AppShell = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const learningActive = isLearningRoute(pathname);

  return (
    <div className="app-shell">
      <div className="app-grain" aria-hidden />

      <header className="topbar">
        <Link to="/" className="brand brand-link" aria-label="IT Птица — обучение">
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
            className={`topbar-nav-link${learningActive ? " is-active" : ""}`}
            aria-current={learningActive ? "page" : undefined}
          >
            Обучение
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
