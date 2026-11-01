import type { QuizResult } from "@/features/quiz";

export function PlanView({ result }: { result: QuizResult }) {
  return (
    <>
      <h1 className="mb-4 font-display text-4xl font-bold uppercase tracking-wide">
        Ваш план
      </h1>
      <p className="mb-2 text-base text-neutral-800">
        Уровень: {result.diagnosis.level} ({result.diagnosis.totalScore} из{" "}
        {result.diagnosis.maxScore})
      </p>
      <p className="mb-8 text-base leading-relaxed text-neutral-800">
        {result.plan.summary}
      </p>
      <ol className="flex flex-col gap-4">
        {result.plan.days.map((d) => (
          <li key={d.day} className="rounded-[4px] border-2 border-black p-4">
            <p className="font-semibold">
              День {d.day}: {d.topic} ({d.duration_min} мин)
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {d.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-neutral-700">
              Результат: {d.result}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
