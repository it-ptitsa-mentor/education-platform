import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

export const AppShell = () => {
  const { theme, toggleTheme } = useTheme();

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