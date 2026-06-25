import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { checkQuiz, fetchQuiz, type QuizCheckResult, type QuizDetail } from "../api";

const toggleOption = (
  current: string[],
  optionId: string,
  multiple: boolean,
): string[] => {
  if (multiple) {
    return current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
  }

  return [optionId];
};

type QuizRunnerProps = {
  slug: string;
  embedded?: boolean;
  onPassed?: () => void;
};

export const QuizRunner = ({ slug, embedded = false, onPassed }: QuizRunnerProps) => {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [step, setStep] = useState(0);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<QuizCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passedNotified, setPassedNotified] = useState(false);

  const questionCount = quiz?.questions.length ?? 0;
  const isResults = Boolean(quiz && step >= questionCount);
  const currentQuestion = quiz && !isResults ? quiz.questions[step] : null;

  useEffect(() => {
    if (!slug) return;

    setError(null);
    setResult(null);
    setAnswers({});
    setStep(0);
    setPassedNotified(false);
    fetchQuiz(slug)
      .then((detail) => setQuiz(detail))
      .catch((err: Error) => setError(err.message));
  }, [slug]);

  useEffect(() => {
    if (result?.passed && onPassed && !passedNotified) {
      setPassedNotified(true);
      onPassed();
    }
  }, [onPassed, passedNotified, result]);

  const finishQuiz = useCallback(
    async (finalAnswers: Record<string, string[]>) => {
      if (!quiz || checking) return;

      setChecking(true);
      setError(null);

      try {
        const check = await checkQuiz(slug, finalAnswers);
        setResult(check);
        setStep(quiz.questions.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Проверка не удалась");
      } finally {
        setChecking(false);
      }
    },
    [checking, quiz, slug],
  );

  const advanceAfterAnswer = useCallback(
    (questionId: string, selected: string[]) => {
      if (!quiz) return;

      const nextAnswers = { ...answers, [questionId]: selected };
      setAnswers(nextAnswers);

      const nextStep = step + 1;
      if (nextStep >= quiz.questions.length) {
        void finishQuiz(nextAnswers);
        return;
      }

      setStep(nextStep);
    },
    [answers, finishQuiz, quiz, step],
  );

  const handleOptionChange = useCallback(
    (optionId: string) => {
      if (!currentQuestion || checking || isResults) return;

      const selected = toggleOption(
        answers[currentQuestion.id] ?? [],
        optionId,
        currentQuestion.multiple,
      );

      if (currentQuestion.multiple) {
        setAnswers((current) => ({
          ...current,
          [currentQuestion.id]: selected,
        }));
        return;
      }

      advanceAfterAnswer(currentQuestion.id, selected);
    },
    [advanceAfterAnswer, answers, checking, currentQuestion, isResults],
  );

  const handleNext = useCallback(() => {
    if (!currentQuestion || checking) return;

    const selected = answers[currentQuestion.id] ?? [];
    if (selected.length === 0) return;

    advanceAfterAnswer(currentQuestion.id, selected);
  }, [advanceAfterAnswer, answers, checking, currentQuestion]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setResult(null);
    setError(null);
    setStep(0);
    setPassedNotified(false);
  }, []);

  if (!slug) {
    return (
      <div className="banner banner-error" role="alert">
        <span className="banner-icon" aria-hidden>
          !
        </span>
        <span className="banner-label">ERR</span>
        Квиз не указан.
      </div>
    );
  }

  return (
    <div className={`quiz-runner${embedded ? " quiz-runner--embedded" : ""}`}>
      {!embedded && (
        <div className="exercise-toolbar">
          <Link to="/quizzes" className="back-link">
            <span aria-hidden>←</span>
            Квизы
          </Link>

          <div className="exercise-toolbar-title">
            {quiz ? (
              <>
                <span className="exercise-toolbar-kicker">QUIZ</span>
                <span className="exercise-toolbar-name">{quiz.title}</span>
              </>
            ) : (
              <span className="exercise-toolbar-name exercise-toolbar-name--muted">
                LOADING
              </span>
            )}
          </div>

          {quiz && !isResults && (
            <div className="quiz-toolbar-actions">
              <span className="quiz-progress">
                {step + 1} / {questionCount}
              </span>
              {currentQuestion?.multiple && (
                <button
                  type="button"
                  className="check-btn"
                  onClick={handleNext}
                  disabled={
                    checking || (answers[currentQuestion.id]?.length ?? 0) === 0
                  }
                >
                  <span className="check-btn-label">
                    {step === questionCount - 1 ? "ЗАВЕРШИТЬ" : "ДАЛЕЕ"}
                  </span>
                </button>
              )}
            </div>
          )}

          {isResults && (
            <button type="button" className="check-btn" onClick={handleRestart}>
              <span className="check-btn-label">СНОВА</span>
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon" aria-hidden>
            !
          </span>
          <span className="banner-label">ERR</span>
          {error}
        </div>
      )}

      {checking && (
        <div className="loading">
          <span className="spinner spinner-lg" aria-hidden />
          <span className="loading-text">CHECKING</span>
        </div>
      )}

      {quiz && isResults && result && !checking && (
        <div className="quiz-results">
          <div
            className={`quiz-results-summary ${result.passed ? "is-passed" : "is-failed"}`}
          >
            <span className="quiz-results-label">{result.passed ? "OK" : "FAIL"}</span>
            <p className="quiz-results-score">
              {result.score} / {result.total}
            </p>
            <p className="quiz-results-caption">правильных ответов</p>
            {embedded && (
              <button
                type="button"
                className="lesson-cta lesson-cta--ghost lesson-cta--compact"
                onClick={handleRestart}
              >
                Пройти снова
              </button>
            )}
          </div>

          <div className="quiz-stack">
            {quiz.questions.map((question, index) => {
              const selected = answers[question.id] ?? [];
              const questionResult = result.results.find(
                (item) => item.questionId === question.id,
              );

              return (
                <section key={question.id} className="quiz-card">
                  <header className="quiz-card-head">
                    <span className="quiz-card-index">Q{index + 1}</span>
                    <div className="quiz-card-prompt prose">
                      <ReactMarkdown>{question.prompt}</ReactMarkdown>
                    </div>
                  </header>

                  <div className="quiz-options">
                    {question.options.map((option) => {
                      const isSelected = selected.includes(option.id);
                      const isCorrect = questionResult?.correctOptionIds.includes(
                        option.id,
                      );
                      const isWrong =
                        questionResult &&
                        questionResult.selectedOptionIds.includes(option.id) &&
                        !isCorrect;

                      return (
                        <div
                          key={option.id}
                          className={`quiz-option${isSelected ? " is-selected" : ""}${
                            isCorrect ? " is-correct" : ""
                          }${isWrong ? " is-wrong" : ""}`}
                        >
                          <span className="quiz-option-text prose">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <>{children}</>,
                              }}
                            >
                              {option.text}
                            </ReactMarkdown>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {quiz && currentQuestion && !checking && !isResults && (
        <div className="quiz-stack quiz-stack--single">
          <section className={`quiz-card${embedded ? " quiz-card--lesson" : ""}`}>
            <header className="quiz-card-head">
              <div className="quiz-card-meta">
                <span className="quiz-card-index">
                  {String(step + 1).padStart(2, "0")}
                </span>
                <span className="quiz-progress">
                  {step + 1} / {questionCount}
                </span>
              </div>
              <div className="quiz-card-prompt lesson-content prose">
                <ReactMarkdown>{currentQuestion.prompt}</ReactMarkdown>
              </div>
              {currentQuestion.multiple && (
                <p className="quiz-card-hint">Можно выбрать несколько вариантов</p>
              )}
            </header>

            <div className="quiz-options">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] ?? [];
                const isSelected = selected.includes(option.id);

                return (
                  <label
                    key={option.id}
                    className={`quiz-option${isSelected ? " is-selected" : ""}`}
                  >
                    <input
                      type={currentQuestion.multiple ? "checkbox" : "radio"}
                      name={currentQuestion.id}
                      checked={isSelected}
                      onChange={() => handleOptionChange(option.id)}
                    />
                    <span className="quiz-option-text prose">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <>{children}</>,
                        }}
                      >
                        {option.text}
                      </ReactMarkdown>
                    </span>
                  </label>
                );
              })}
            </div>

            {embedded && currentQuestion.multiple && (
              <footer className="quiz-card-footer">
                <button
                  type="button"
                  className="lesson-cta lesson-cta--practice lesson-cta--compact"
                  onClick={handleNext}
                  disabled={
                    checking || (answers[currentQuestion.id]?.length ?? 0) === 0
                  }
                >
                  {step === questionCount - 1 ? "Завершить" : "Далее →"}
                </button>
              </footer>
            )}
          </section>
        </div>
      )}

      {!quiz && !error && (
        <div className="loading">
          <span className="spinner spinner-lg" aria-hidden />
          <span className="loading-text">LOADING QUIZ</span>
        </div>
      )}
    </div>
  );
};
