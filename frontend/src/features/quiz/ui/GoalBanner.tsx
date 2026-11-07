import { useEffect } from 'react';
import { quizApi } from '../api/quizApi';
import { useGoalStore } from '../model/goalStore';

interface GoalBannerProps {
  userId: string | null;
}

// Цель пользователя: белый текст на синем прямоугольнике. Нет цели — ничего не показываем.
export function GoalBanner({ userId }: GoalBannerProps) {
  const goal = useGoalStore((s) => s.goal);

  useEffect(() => {
    useGoalStore.getState().load(userId);
    if (!userId) return undefined;

    // если бэкенд хранит цель, она важнее локальной копии
    let cancelled = false;
    quizApi
      .latest()
      .then((result) => {
        const fromServer = result?.goal?.trim();
        if (!cancelled && fromServer) useGoalStore.getState().set(userId, fromServer);
      })
      .catch(() => {
        // цель — украшение: если запрос не удался, остаётся локальная
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!goal) return null;

  return (
    <section
      aria-label="Ваша цель"
      className="rounded-[4px] border-2 border-brand-950 bg-brand-600 p-3 text-white shadow-hard-sm"
    >
      <p className="font-display text-xs uppercase tracking-wide text-white/70">Ваша цель</p>
      <p title={goal} className="mt-1 max-h-32 overflow-y-auto break-words font-sans text-sm leading-snug">
        {goal}
      </p>
    </section>
  );
}
