import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { quizApi, type QuizResult } from "@/features/quiz";
import {
  getCompleteBlock,
  getStreakStatus,
  planKeyOf,
  pluralDays,
  useStreak,
  useStreakStore,
} from "@/features/streak";
import { Button, useToast } from "@/shared/ui";

const BLOCK_HINT = {
  order: "Сначала выполните предыдущие дни",
  today: "Сегодня день уже засчитан. Следующий — завтра",
} as const;

interface PlanPanelProps {
  // ширина на десктопе, px (меняется ручкой в ChatPage)
  width?: number;
}

export function PlanPanel({ width }: PlanPanelProps) {
  const [result, setResult] = useState<QuizResult | null>(); // undefined = грузится, null = теста нет
  const [failed, setFailed] = useState(false);
  const { data, today } = useStreak();
  const { success } = useToast();

  useEffect(() => {
    quizApi
      .latest()
      .then(setResult)
      .catch(() => setFailed(true));
  }, []);

  const plan = result?.plan;
  const planKey = useMemo(() => (plan ? planKeyOf(plan) : ""), [plan]);
  const allDays = useMemo(() => plan?.days.map((d) => d.day) ?? [], [plan]);
  const doneDays = data.completed[planKey] ?? [];
  // план, созданный через «Быстрый старт», а не через тест
  const isQuickstart = result?.diagnosis.mode === "quickstart";

  const completeDay = (day: number) => {
    useStreakStore.getState().complete(planKey, day, today);
    // сразу после отметки смотрим, какая получилась серия
    const { current } = getStreakStatus(
      useStreakStore.getState().data.dates,
      today,
    );
    success(
      `Огонёк за сегодня! Серия: ${current} ${pluralDays(current)}`,
      `День ${day} выполнен. Возвращайтесь завтра, чтобы поддержать серию.`,
    );
  };

  return (
    <aside
      style={
        width ? ({ "--plan-w": `${width}px` } as CSSProperties) : undefined
      }
      className="scrollbar-brand hidden w-80 shrink-0 flex-col overflow-y-auto border-l-2 border-black p-4 lg:flex lg:w-[var(--plan-w,20rem)] dark:border-ink-700"
    >
      <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide">
        Ваш план
      </h2>

      {failed && (
        <p className="text-sm opacity-70">Не удалось загрузить план</p>
      )}
      {!failed && result === undefined && (
        <p className="text-sm opacity-70">Загрузка...</p>
      )}

      {result === null && (
        <>
          <p className="mb-3 text-sm opacity-70">Вы ещё не проходили тест.</p>
          <Link
            to={ROUTES.QUIZ}
            className="rounded-[4px] border-2 border-brand-950 bg-brand-600 px-3 py-2 text-center font-display text-base font-medium text-white shadow-inset-hard hover:bg-brand-700"
          >
            Пройти тест
          </Link>
        </>
      )}

      {result && (
        <>
          <p className="mb-1 text-xs opacity-70">
            {isQuickstart
              ? "Быстрый старт"
              : `Уровень: ${result.diagnosis.level}`}
          </p>
          <p className="mb-2 text-sm">{result.plan.summary}</p>
          <p className="mb-4 text-xs opacity-70">
            Выполнено: {doneDays.length} из {result.plan.days.length}
          </p>
          <ol className="flex flex-col gap-2">
            {result.plan.days.map((d) => {
              const isDone = doneDays.includes(d.day);
              const block = getCompleteBlock(
                data,
                planKey,
                d.day,
                allDays,
                today,
              );
              return (
                <li key={d.day}>
                  <details className="rounded-[4px] border-2 border-black p-2 dark:border-ink-600">
                    <summary className="cursor-pointer font-display text-base font-medium">
                      {isDone && <span aria-hidden="true">✓ </span>}
                      День {d.day}: {d.topic}
                      {isDone && <span className="sr-only"> (выполнен)</span>}
                    </summary>

                    {d.theory && (
                      <>
                        <p className="mt-2 text-xs font-bold uppercase opacity-70">
                          Теория
                        </p>
                        <p className="text-xs">{d.theory}</p>
                      </>
                    )}

                    <p className="mt-2 text-xs font-bold uppercase opacity-70">
                      Задания
                    </p>
                    <ul className="list-disc pl-5 text-xs">
                      {d.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs opacity-70">
                      Результат: {d.result}
                    </p>

                    {d.articles && d.articles.length > 0 && (
                      <>
                        <p className="mt-2 text-xs font-bold uppercase opacity-70">
                          Читать и смотреть
                        </p>
                        <ul className="list-disc pl-5 text-xs">
                          {d.articles.map((a) => (
                            <li key={a.id}>
                              <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-600 underline"
                              >
                                {a.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {isDone ? (
                      <p className="mt-3 font-display text-sm font-bold text-brand-600">
                        ✓ День выполнен
                      </p>
                    ) : (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          fullWidth
                          disabled={block !== null}
                          onClick={() => completeDay(d.day)}
                          className="disabled:opacity-100 disabled:bg-ink-200 disabled:text-ink-500 disabled:shadow-none disabled:border-ink-300"
                        >
                          Отметить выполненным
                        </Button>
                        {block && block !== "done" && (
                          <p className="mt-1 text-xs opacity-70">
                            {BLOCK_HINT[block]}
                          </p>
                        )}
                      </div>
                    )}
                  </details>
                </li>
              );
            })}
          </ol>
          <Link
            to={ROUTES.QUIZ}
            className="mt-4 text-center text-xs underline opacity-70"
          >
            Пройти тест заново
          </Link>
        </>
      )}
    </aside>
  );
}
