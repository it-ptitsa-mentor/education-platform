import type { Theme } from "../hooks/useTheme";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => (
  <button
    type="button"
    className="theme-toggle"
    onClick={onToggle}
    aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
    title={theme === "dark" ? "Light mode" : "Dark mode"}
  >
    <span className="theme-toggle-track" aria-hidden>
      <span className={`theme-toggle-thumb ${theme}`} />
    </span>
    <span className="theme-toggle-label">{theme === "dark" ? "DARK" : "LIGHT"}</span>
  </button>
);
