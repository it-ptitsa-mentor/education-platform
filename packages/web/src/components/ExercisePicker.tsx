import { useEffect, useId, useRef, useState } from "react";
import type { ExerciseSummary } from "../api";

type ExercisePickerProps = {
  exercises: ExerciseSummary[];
  slug: string;
  onChange: (slug: string) => void;
};

export const ExercisePicker = ({
  exercises,
  slug,
  onChange,
}: ExercisePickerProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = exercises.find((item) => item.slug === slug);

  useEffect(() => {
    const handlePointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="picker" ref={rootRef}>
      <span className="picker-label">Упражнение</span>
      <button
        type="button"
        className="picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="picker-value">{current?.title ?? "…"}</span>
        <span className={`picker-chevron ${open ? "open" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul className="picker-menu" id={listId} role="listbox">
          {exercises.map((item) => (
            <li key={item.slug} role="option" aria-selected={item.slug === slug}>
              <button
                type="button"
                className={`picker-option ${item.slug === slug ? "active" : ""}`}
                onClick={() => {
                  onChange(item.slug);
                  setOpen(false);
                }}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
