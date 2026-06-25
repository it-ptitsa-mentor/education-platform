import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import type { LessonNavLink } from "../lib/lesson-units";

type ExercisePassModalProps = {
  continueLink: LessonNavLink;
  onClose: () => void;
};

export const ExercisePassModal = ({
  continueLink,
  onClose,
}: ExercisePassModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="course-modal" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="course-modal-panel exercise-pass-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="course-modal-head">
          <div>
            <p className="course-modal-kicker">Практика</p>
            <h2 id={titleId} className="course-modal-title">
              Задание выполнено
            </h2>
          </div>
          <button
            type="button"
            className="course-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className="exercise-pass-modal-body">
          <p className="exercise-pass-modal-text">
            Все тесты пройдены. Можно перейти к следующему шагу или закрыть окно
            и остаться в редакторе.
          </p>
          <Link
            to={continueLink.to}
            className="exercise-pass-modal-cta"
            onClick={onClose}
          >
            <span className="exercise-pass-modal-cta-kicker">Далее</span>
            <span className="exercise-pass-modal-cta-title">
              {continueLink.title}
            </span>
            {continueLink.hint ? (
              <span className="exercise-pass-modal-cta-hint">
                {continueLink.hint}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </div>
  );
};
