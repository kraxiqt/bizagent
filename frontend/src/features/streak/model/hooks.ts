import { useEffect, useMemo, useState } from 'react';
import { useStreakStore } from './store';
import { getStreakStatus, toDateKey } from './streak';

// Сегодняшняя дата; обновляется сама, если приложение открыто через полночь.
export function useToday(): string {
  const [today, setToday] = useState(() => toDateKey());
  useEffect(() => {
    const update = () => setToday(toDateKey());
    const timer = setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return today;
}

// Вызывать ОДИН раз, в ChatLayout: подгружает серию текущего пользователя.
export function useStreakSync(userId: string | null) {
  useEffect(() => {
    useStreakStore.getState().load(userId);
  }, [userId]);
}

export function useStreak() {
  const data = useStreakStore((s) => s.data);
  const today = useToday();
  const status = useMemo(() => getStreakStatus(data.dates, today), [data.dates, today]);
  return { data, today, status };
}
