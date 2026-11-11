import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { useAuthStore } from "@/features/auth";
import {
  quizApi,
  savePlanSettings,
  useGoalStore,
  type QuizResult,
} from "@/features/quiz";
import { getErrorMessage } from "@/shared/api/errorHandler";
import { cn } from "@/shared/lib/cn";
import { Button, Logo, Textarea } from "@/shared/ui";
import { InterestList } from "./InterestList";
import { getInterestProfile } from "./interests";
import { QUIZ_QUESTIONS } from "./quizData";
import { PlanView } from "./PlanView";

const DAYS_OPTIONS = [7, 14, 30] as const;

const HOURS_OPTIONS = [0.5, 1, 2, 3];
const GOAL_MIN_LENGTH = 5;
const GOAL_MAX_LENGTH = 500;

// Вариант ответа: белая карточка с чёрной рамкой, выбранный — синий с тёмной кромкой снизу.
const optionClass = (active: boolean) =>
  cn(
    "rounded-[4px] border-2 border-black px-5 py-4 text-left font-display text-lg font-medium transition-colors",
    active
      ? "bg-brand-600 text-white shadow-inset-hard"
      : "bg-white text-black hover:bg-brand-50",
  );

// Короткие кнопки настроек плана (дни / часы).
const chipClass = (active: boolean) =>
  cn(optionClass(active), "min-w-[90px] px-4 py-3 text-center");

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const total = QUIZ_QUESTIONS.length;
  // «Быстрый старт» с страницы выбора: вопросы пропускаем, сразу настройки и цель
  const quick = searchParams.get("mode") === "quick";
  const flowStart = quick ? total : 0;
  const flowLength = quick ? 2 : total + 2;

  // 0..total-1 — вопросы, total — настройки плана, total+1 — цель
  const [step, setStep] = useState(flowStart);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(total).fill(null),
  );
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [goal, setGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<QuizResult>();

  const isSettings = step === total;
  const isGoal = step === total + 1;
  const question = QUIZ_QUESTIONS[step];
  const selected = isSettings || isGoal ? null : answers[step];
  const progress = result ? 100 : ((step - flowStart) / flowLength) * 100;
  const goalReady = goal.trim().length >= GOAL_MIN_LENGTH;
  // направления из каталога «Альфа-Курса», которые пользователь выбирал чаще всего
  const interests = getInterestProfile(QUIZ_QUESTIONS, answers);

  const selectOption = (index: number) =>
    setAnswers((prev) => prev.map((v, i) => (i === step ? index : v)));

  const submit = async () => {
    // быстрый старт: квиз не проходили, плана нет — сохраняем цель и настройки и идём в чат
    if (quick) {
      if (userId) {
        useGoalStore.getState().set(userId, goal.trim());
        savePlanSettings(userId, { days, hoursPerDay });
      }
      navigate(ROUTES.CHAT, { replace: true });
      return;
    }

    setSubmitting(true);
    setError(undefined);
    try {
      const data = await quizApi.submit({
        days,
        hoursPerDay,
        goal: goal.trim(),
        answers: QUIZ_QUESTIONS.map((q, i) => ({
          questionId: q.id,
          optionIndex: answers[i] as number,
        })),
      });
      // цель покажем в левой панели чата
      if (userId) useGoalStore.getState().set(userId, goal.trim());
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось создать план"));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
        <div className="mb-12 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <InterestList interests={interests} />
          <PlanView result={result} />
          <Button
            size="lg"
            fullWidth
            className="mt-10"
            onClick={() => navigate(ROUTES.CHAT, { replace: true })}
          >
            Перейти в чат
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col bg-white px-6 py-10 text-black sm:px-10">
      <div className="mb-12 flex justify-center">
        <Logo size="lg" />
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-2 flex items-center justify-between font-sans text-base font-bold">
          <span>
            {isGoal
              ? "Ваша цель"
              : isSettings
                ? "Настройки плана"
                : `Вопрос ${step + 1} из ${total}`}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mb-10 h-2.5 w-full border border-black bg-white">
          <div
            className="h-full bg-brand-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isGoal ? (
          <>
            <h1 className="mb-6 font-sans text-2xl font-bold leading-snug">
              Опишите цель, которую хотите достичь
            </h1>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              maxLength={GOAL_MAX_LENGTH}
              rows={6}
              placeholder="Например: запустить онлайн-школу английского и получить первых 10 клиентов за 2 месяца"
              aria-label="Ваша цель"
              className="p-4 text-lg"
            />
            <p className="mt-2 text-right font-sans text-sm text-ink-600">
              {goal.length}/{GOAL_MAX_LENGTH}
            </p>
          </>
        ) : isSettings ? (
          <>
            <h1 className="mb-6 font-sans text-2xl font-bold leading-snug">
              Сколько дней и часов в день?
            </h1>
            <div className="mb-6 flex flex-wrap gap-3">
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={chipClass(days === d)}
                  onClick={() => setDays(d)}
                >
                  {d} дней
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {HOURS_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={chipClass(hoursPerDay === h)}
                  onClick={() => setHoursPerDay(h)}
                >
                  {h} ч
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-6 font-sans text-2xl font-bold leading-snug">
              {question.text}
            </h1>
            <div
              role="radiogroup"
              aria-label="Варианты ответа"
              className="flex flex-col gap-3"
            >
              {question.options.map((option, index) => {
                const isChecked = selected === index;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isChecked}
                    onClick={() => selectOption(index)}
                    className={optionClass(isChecked)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-[4px] border-2 border-black px-3 py-2 text-sm"
          >
            {error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={() => (step > flowStart ? setStep((s) => s - 1) : navigate(ROUTES.START))}
            disabled={submitting || (!quick && step === 0)}
            className="min-w-[110px] font-bold uppercase"
          >
            Назад
          </Button>
          {isGoal ? (
            <Button
              onClick={submit}
              disabled={submitting || !goalReady}
              className="min-w-[110px] font-bold uppercase"
            >
              {submitting ? "Создаём план..." : "Создать план"}
            </Button>
          ) : (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!isSettings && selected === null}
              className="min-w-[110px] font-bold uppercase"
            >
              Далее
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
