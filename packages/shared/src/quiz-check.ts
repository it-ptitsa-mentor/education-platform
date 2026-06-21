import type {
  PublicQuizDetail,
  QuizCheckPayload,
  QuizCheckResult,
  QuizManifest,
  QuizQuestionResult,
} from "./quiz-manifest-types.js";

const normalizeIds = (ids: string[]) => [...new Set(ids)].sort();

const sameSet = (left: string[], right: string[]) => {
  const a = normalizeIds(left);
  const b = normalizeIds(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
};

export const toPublicQuizDetail = (manifest: QuizManifest): PublicQuizDetail => ({
  slug: manifest.slug,
  title: manifest.title,
  questions: manifest.questions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    multiple: question.multiple,
    options: question.options.map(({ id, text }) => ({ id, text })),
  })),
});

export const checkQuizAnswers = (
  manifest: QuizManifest,
  payload: QuizCheckPayload,
): QuizCheckResult => {
  const results: QuizQuestionResult[] = manifest.questions.map((question) => {
    const selectedOptionIds = normalizeIds(payload.answers[question.id] ?? []);
    const correctOptionIds = normalizeIds(
      question.options.filter((option) => option.correct).map((option) => option.id),
    );

    return {
      questionId: question.id,
      passed: sameSet(selectedOptionIds, correctOptionIds),
      selectedOptionIds,
      correctOptionIds,
    };
  });

  const score = results.filter((result) => result.passed).length;

  return {
    passed: score === results.length,
    score,
    total: results.length,
    results,
  };
};
