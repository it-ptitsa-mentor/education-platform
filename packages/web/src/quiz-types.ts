export type QuizSummary = {
  slug: string;
  title: string;
  language: string;
  categoryId: string;
  categoryName: string;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  multiple: boolean;
  options: QuizOption[];
};

export type QuizDetail = {
  slug: string;
  title: string;
  questions: QuizQuestion[];
};

export type QuizCheckResult = {
  passed: boolean;
  score: number;
  total: number;
  results: Array<{
    questionId: string;
    passed: boolean;
    selectedOptionIds: string[];
    correctOptionIds: string[];
  }>;
};
