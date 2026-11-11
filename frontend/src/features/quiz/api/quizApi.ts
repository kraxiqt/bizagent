import { apiClient } from "@/shared/api/baseClient";

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface QuizSubmitDto {
  days: 7 | 14 | 30;
  hoursPerDay: number;
  goal: string;
  answers: { questionId: string; optionIndex: number }[];
}

// «Быстрый старт»: то же самое, но без ответов теста
export type QuickstartDto = Omit<QuizSubmitDto, "answers">;

export interface QuizDiagnosis {
  totalScore: number;
  maxScore: number;
  level: string;
  weakTopics: string[];
  strongTopics: string[];
  // "quickstart" для плана, созданного через «Быстрый старт»
  mode?: string;
}

export interface QuizArticle {
  id: string;
  title: string;
  url: string;
  type: "article" | "term" | "course";
}

export interface QuizPlanDay {
  day: number;
  topic: string;
  tasks: string[];
  result: string;
  duration_min: number;
  // есть только у плана «Быстрого старта»
  theory?: string;
  articles?: QuizArticle[];
}

export interface QuizPlan {
  summary: string;
  days: QuizPlanDay[];
  tips: string[];
}

export interface QuizResult {
  diagnosis: QuizDiagnosis;
  plan: QuizPlan;
  // если бэкенд отдаёт сохранённую цель, показываем её; иначе берём ту, что пользователь ввёл в этом браузере
  goal?: string;
}

export const quizApi = {
  //вопросы теста с бэкенда (GET /api/quiz)
  questions: () => apiClient.get<QuizQuestion[]>("/quiz"),
  submit: (dto: QuizSubmitDto) =>
    apiClient.post<QuizResult>("/quiz/submit", dto, { timeoutMs: 120_000 }),
  // быстрый старт: план по цели, дням и часам без теста (POST /api/quickstart/plan)
  quickstart: (dto: QuickstartDto) =>
    apiClient.post<QuizResult>("/quickstart/plan", dto, { timeoutMs: 120_000 }),
  latest: () => apiClient.get<QuizResult | null>("/quiz/latest"),
};
