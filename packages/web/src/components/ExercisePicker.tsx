import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { ExerciseSummary } from "../api";

type ExercisePickerProps = {
  exercises: ExerciseSummary[];
  slug: string;
  onChange: (slug: string) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

export const ExercisePicker = ({
  exercises,
  slug,
  onChange,
}: ExercisePickerProps) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = exercises.find((item) => item.slug === slug);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, exercises.length, current?.title]);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (
        document
          .getElementById(listId)
          ?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleLayout = () => updateMenuPosition();

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleLayout);
    window.addEventListener("scroll", handleLayout, true);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleLayout);
      window.removeEventListener("scroll", handleLayout, true);
    };
  }, [open, listId]);

  const menu =
    open && menuPosition
      ? createPortal(
          <ul
            className="picker-menu picker-menu--portal"
            id={listId}
            role="listbox"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
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
                  <span className="picker-option-title">{item.title}</span>
                  <span className="picker-option-slug">{item.slug}</span>
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="picker">
        <button
          ref={triggerRef}
          type="button"
          className="picker-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="picker-icon" aria-hidden>
            ◈
          </span>
          <span className="picker-value">{current?.title ?? "Загрузка…"}</span>
          <span className={`picker-chevron ${open ? "open" : ""}`} aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      {menu}
    </>
  );
};
