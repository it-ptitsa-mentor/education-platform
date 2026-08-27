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

// Реальный скролл страницы происходит не в html/body (те и так свёрнуты
// в .app-shell{overflow:hidden}), а во внутреннем контейнере .app-main
// (overflow-y: auto). Поэтому одного html/body overflow:hidden недостаточно —
// фон под модалкой продолжает скроллиться. Блокируем через общий счётчик
// открытых модалок (document.body.dataset), чтобы несколько модалок подряд
// или наложенных друг на друга (см. LessonNavigatorModal, открытая поверх
// TopicLessonsModal) не «залипали» в заблокированном состоянии — разблокируем
// только когда закрылась последняя.
let lockCount = 0;

const lockBodyScroll = () => {
  lockCount += 1;
  if (lockCount > 1) return;
  document.body.classList.add("modal-open");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  document.body.classList.remove("modal-open");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};

/**
 * Общее поведение модалок курса: Esc закрывает, Enter выполняет основное
 * действие (если задано и фокус не перехвачен), фон блокируется на один
 * скролл (класс modal-open останавливает скролл .app-main — реального
 * скролл-контейнера страницы, — плюс html/body на случай других лейаутов),
 * автофокус на панели при открытии. Блокировка снимается и при закрытии,
 * и при размонтировании; счётчик не даёт «залипнуть», если открыты сразу
 * несколько модалок.
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

    lockBodyScroll();
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll();
    };
  }, [onClose, onEnter]);

  return panelRef;
};
