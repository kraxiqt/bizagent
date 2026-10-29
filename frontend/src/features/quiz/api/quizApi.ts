import { apiClient } from '@/shared/api/baseClient';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface QuizSubmitDto {
  days: 7 | 14;
  hoursPerDay: number;
  answers: { questionId: string; optionIndex: number }[];
}

export interface QuizDiagnosis {
  totalScore: number;
  maxScore: number;
  level: string;
  weakTopics: string[];
  strongTopics: string[];
}

export interface QuizPlanDay {
  day: number;
  topic: string;
  tasks: string[];
  result: string;
  duration_min: number;
}

export interface QuizPlan {
  summary: string;
  days: QuizPlanDay[];
  tips: string[];
}

export interface QuizResult {
  diagnosis: QuizDiagnosis;
  plan: QuizPlan;
}

export const quizApi = {
  //вопросы теста с бэкенда (GET /api/quiz)
  questions: () => apiClient.get<QuizQuestion[]>('/quiz'),
  submit: (dto: QuizSubmitDto) =>
    apiClient.post<QuizResult>('/quiz/submit', dto, { timeoutMs: 120_000 }),
  latest: () => apiClient.get<QuizResult | null>('/quiz/latest'),
};
