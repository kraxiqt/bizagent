import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/router/routes';
import { quizApi, type QuizResult } from '@/features/quiz';
import { getErrorMessage } from '@/shared/api/errorHandler';
import { QUIZ_QUESTIONS } from './quizData';

const DAYS_OPTIONS = [7, 14] as const;
const HOURS_OPTIONS = [0.5, 1, 2, 3];

export function QuizPage() {
  const navigate = useNavigate();
  const total = QUIZ_QUESTIONS.length;

  // 0..total-1 — вопросы, total — настройки плана
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [days, setDays] = useState<7 | 14>(7);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<QuizResult>();

  const isSettings = step === total;
  const question = QUIZ_QUESTIONS[step];
  const selected = isSettings ? null : answers[step];
  const progress = result ? 100 : (step / (total + 1)) * 100;

  const selectOption = (index: number) =>
    setAnswers((prev) => prev.map((v, i) => (i === step ? index : v)));

  const submit = async () => {
    setSubmitting(true);
    setError(undefined);
    try {
      const data = await quizApi.submit({
        days,
        hoursPerDay,
        answers: QUIZ_QUESTIONS.map((q, i) => ({
          questionId: q.id,
          optionIndex: answers[i] as number,
        })),
      });
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось создать план'));
    } finally {
      setSubmitting(false);
    }
  };

  const optionClass = (active: boolean) =>
    `h-12 min-w-[90px] border-2 border-black px-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
      active ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
    }`;

  if (result) {
    return (
      <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold uppercase tracking-wide">Ваш план</h1>
          <p className="mb-2 text-base text-neutral-800">
            Уровень: {result.diagnosis.level} ({result.diagnosis.totalScore} из {result.diagnosis.maxScore})
          </p>
          <p className="mb-8 text-base leading-relaxed text-neutral-800">{result.plan.summary}</p>
          <ol className="flex flex-col gap-4">
            {result.plan.days.map((d) => (
              <li key={d.day} className="border-2 border-black p-4">
                <p className="font-semibold">
                  День {d.day}: {d.topic} ({d.duration_min} мин)
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {d.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-neutral-700">Результат: {d.result}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => navigate(ROUTES.CHAT, { replace: true })}
            className="mt-10 h-12 w-full border-2 border-black bg-black text-base font-semibold uppercase tracking-wide text-white hover:bg-white hover:text-black"
          >
            Перейти в чат
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-neutral-700">
          <span>{isSettings ? 'Настройки плана' : `Вопрос ${step + 1} из ${total}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mb-10 h-2 w-full border border-black bg-white">
          <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>

        {isSettings ? (
          <>
            <h1 className="mb-6 text-2xl font-semibold sm:text-3xl">Сколько дней и часов в день?</h1>
            <div className="mb-6 flex flex-wrap gap-3">
              {DAYS_OPTIONS.map((d) => (
                <button key={d} type="button" className={optionClass(days === d)} onClick={() => setDays(d)}>
                  {d} дней
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {HOURS_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={optionClass(hoursPerDay === h)}
                  onClick={() => setHoursPerDay(h)}
                >
                  {h} ч
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="mt-6 border-2 border-black px-3 py-2 text-sm">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="mb-8 text-2xl font-semibold leading-snug sm:text-3xl">{question.text}</h1>
            <div role="radiogroup" aria-label="Варианты ответа" className="flex flex-col gap-3">
              {question.options.map((option, index) => {
                const isChecked = selected === index;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isChecked}
                    onClick={() => selectOption(index)}
                    className={`flex items-center gap-4 border-2 border-black px-5 py-4 text-left text-base transition-colors ${
                      isChecked ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="h-11 min-w-[120px] border-2 border-black bg-white px-6 text-sm font-semibold uppercase tracking-wide disabled:opacity-40"
          >
            Назад
          </button>
          {isSettings ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="h-11 min-w-[120px] border-2 border-black bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-40"
            >
              {submitting ? 'Создаём план...' : 'Создать план'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={selected === null}
              className="h-11 min-w-[120px] border-2 border-black bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-40"
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
