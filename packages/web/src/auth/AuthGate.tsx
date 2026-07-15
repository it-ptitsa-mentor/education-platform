import { useEffect, useState, type ReactNode } from "react";
import { cabinetLoginUrl, loadAuthState, type AuthState } from "./authState";

/**
 * Гейт тренажёра: пока грузится — спиннер; нет сессии — экран входа в кабинет;
 * нет доступа — экран запроса доступа; кабинет недоступен — ошибка с ретраем.
 * При ok рендерит children (само приложение).
 */
export const AuthGate = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ kind: "loading" });
    loadAuthState().then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, [attempt]);

  if (state.kind === "ok") return <>{children}</>;
  if (state.kind === "loading") {
    return <Screen>Загружаем тренажёр…</Screen>;
  }
  if (state.kind === "anon") {
    return (
      <Screen title="Вход в тренажёр">
        <p>Тренажёр IT Птицы доступен ученикам менторства. Войди через кабинет — и продолжай прямо здесь.</p>
        <a className="auth-btn" href={cabinetLoginUrl()}>
          Войти через кабинет
        </a>
      </Screen>
    );
  }
  if (state.kind === "no_access") {
    return (
      <Screen title="Нет доступа к тренажёру">
        <p>
          Ты вошёл{state.user.full_name ? `, ${state.user.full_name}` : ""}, но доступ к тренажёру ещё не открыт.
          Запроси его в кабинете — куратор или ментор откроет.
        </p>
        <a className="auth-btn" href={cabinetLoginUrl()}>
          Открыть кабинет
        </a>
      </Screen>
    );
  }
  return (
    <Screen title="Сервис входа недоступен">
      <p>Не удалось проверить доступ. Попробуй ещё раз через минуту.</p>
      <button className="auth-btn" type="button" onClick={() => setAttempt((a) => a + 1)}>
        Повторить
      </button>
    </Screen>
  );
};

const Screen = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="auth-screen">
    <div className="auth-card">
      <img src={`${import.meta.env.BASE_URL}it-ptitsa.gif`} alt="IT Птица" className="auth-logo" />
      {title && <h1 className="auth-title">{title}</h1>}
      <div className="auth-body">{children}</div>
    </div>
  </div>
);
