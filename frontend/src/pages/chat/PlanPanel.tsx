import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { quizApi, type QuizResult } from "@/features/quiz";

export function PlanPanel() {
  const [result, setResult] = useState<QuizResult | null>(); // undefined = грузится, null = теста нет
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    quizApi
      .latest()
      .then(setResult)
      .catch(() => setFailed(true));
  }, []);

  return (
    <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l p-4 lg:flex">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
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
            className="rounded border px-3 py-2 text-center text-sm font-medium"
          >
            Пройти тест
          </Link>
        </>
      )}

      {result && (
        <>
          <p className="mb-1 text-xs opacity-70">
            Уровень: {result.diagnosis.level}
          </p>
          <p className="mb-4 text-sm">{result.plan.summary}</p>
          <ol className="flex flex-col gap-2">
            {result.plan.days.map((d) => (
              <li key={d.day}>
                <details className="rounded border p-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    День {d.day}: {d.topic}
                  </summary>
                  <ul className="mt-2 list-disc pl-5 text-xs">
                    {d.tasks.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs opacity-70">
                    Результат: {d.result}
                  </p>
                </details>
              </li>
            ))}
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
