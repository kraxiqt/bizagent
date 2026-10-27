// Вопросы теста. Один вариант ответа на каждый вопрос.
// Тексты — заготовка: замените на свои вопросы, структура менять не нужно.
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Вопрос 1',
    options: ['1', '2', '3', '4'],
  },
  {
    id: 'q2',
    text: 'Вопрос 2',
    options: ['1', '2', '3', '4'],
  },
  {
    id: 'q3',
    text: 'Вопрос 3',
    options: ['1', '2', '3', '4'],
  },
  {
    id: 'q4',
    text: 'Вопрос 4',
    options: ['1', '2', '3', '4'],
  },
  {
    id: 'q5',
    text: 'Вопрос 5',
    options: ['1', '2', '3', '4'],
  },
];
