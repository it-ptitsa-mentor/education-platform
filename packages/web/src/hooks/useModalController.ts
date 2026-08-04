import { useEffect, useRef, type RefObject } from "react";

type UseModalControllerOptions = {
  /** Закрыть модалку (Esc, клик по бэкдропу). */
  onClose: () => void;
  /**
   * Основное действие модалки (например «Далее»). Срабатывает по Enter,
   * но только если фокус не на другом интерактивном элементе (ссылка,
   * кнопка, поле ввода) — чтобы не перебивать его собственное поведение.
   */
  onEnter?: () => void;
};

const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("a, button, input, textarea, select, [role='button']"),
  );
};

/**
 * Общее поведение модалок курса: Esc закрывает, Enter выполняет основное
 * действие (если задано и фокус не перехвачен), фон блокируется на один
 * скролл (html + body — не только body, чтобы не оставался «двойной» скролл
 * позади модалки), автофокус на панели при открытии.
 */
export const useModalController = <T extends HTMLElement>({
  onClose,
  onEnter,
}: UseModalControllerOptions): RefObject<T | null> => {
  const panelRef = useRef<T>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter" && onEnter && !isInteractiveTarget(e.target)) {
        e.preventDefault();
        onEnter();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const html = document.documentElement.style;
    const body = document.body.style;
    const prevHtmlOverflow = html.overflow;
    const prevBodyOverflow = body.overflow;
    html.overflow = "hidden";
    body.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.overflow = prevHtmlOverflow;
      body.overflow = prevBodyOverflow;
    };
  }, [onClose, onEnter]);

  return panelRef;
};
