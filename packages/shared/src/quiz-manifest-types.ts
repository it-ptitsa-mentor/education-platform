export type QuizOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  multiple: boolean;
  options: QuizOption[];
};

export type QuizManifest = {
  slug: string;
  title: string;
  questions: QuizQuestion[];
  hexlet?: {
    courseSlug: string;
    courseName: string;
    lessonSlug: string;
    lessonName: string;
    sourceUrl: string;
    lessonId: number;
  };
};

export type PublicQuizQuestion = {
  id: string;
  prompt: string;
  multiple: boolean;
  options: Array<{ id: string; text: string }>;
};

export type PublicQuizDetail = {
  slug: string;
  title: string;
  questions: PublicQuizQuestion[];
};

export type QuizCheckPayload = {
  answers: Record<string, string[]>;
};

export type QuizQuestionResult = {
  questionId: string;
  passed: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
};

export type QuizCheckResult = {
  passed: boolean;
  score: number;
  total: number;
  results: QuizQuestionResult[];
};
