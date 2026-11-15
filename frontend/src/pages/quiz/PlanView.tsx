import type { QuizResult } from "@/features/quiz";

const TYPE_LABEL: Record<string, string> = {
  article: "Статья",
  term: "Термин",
  course: "Курс",
};

export function PlanView({ result }: { result: QuizResult }) {
  // у плана быстрого старта нет теста, поэтому уровень не показываем
  const quick =
    result.diagnosis.mode === "quickstart" || result.diagnosis.mode === "quick";

  return (
    <>
      <h1 className="mb-4 font-display text-4xl font-bold uppercase tracking-wide">
        Ваш план
      </h1>
      {!quick && (
        <p className="mb-2 text-base text-neutral-800">
          Уровень: {result.diagnosis.level} ({result.diagnosis.totalScore} из{" "}
          {result.diagnosis.maxScore})
        </p>
      )}
      <p className="mb-8 text-base leading-relaxed text-neutral-800">
        {result.plan.summary}
      </p>
      <ol className="flex flex-col gap-4">
        {result.plan.days.map((d) => (
          <li key={d.day} className="rounded-[4px] border-2 border-black p-4">
            <p className="font-semibold">
              День {d.day}: {d.topic} ({d.duration_min} мин)
            </p>
            {d.theory && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                {d.theory}
              </p>
            )}
            <ul className="mt-2 list-disc pl-5 text-sm">
              {d.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-neutral-700">
              Результат: {d.result}
            </p>
            {d.articles && d.articles.length > 0 && (
              <div className="mt-3 text-sm">
                <p className="font-semibold">Почитать дополнительно:</p>
                <ul className="mt-1 list-disc pl-5">
                  {d.articles.map((a) => (
                    <li key={a.id}>
                      {TYPE_LABEL[a.type] ?? "Материал"}:{" "}
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {a.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
