import { create } from 'zustand';
import { storage } from '@/shared/lib/storage';
import { completeDay, EMPTY_STREAK, normalizeStreak, type StreakData } from './streak';

// Пока на бэкенде нет учёта прогресса, серия хранится в браузере отдельно для каждого пользователя.
// Чтобы перенести её на сервер, достаточно заменить чтение/запись в load() и complete().
const keyFor = (userId: string) => `streak:${userId}`;

interface StreakState {
  userId: string | null;
  data: StreakData;
  load: (userId: string | null) => void;
  complete: (planKey: string, day: number, today: string) => void;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  userId: null,
  data: EMPTY_STREAK,

  load: (userId) => {
    if (get().userId === userId) return;
    set({
      userId,
      data: userId ? normalizeStreak(storage.get<unknown>(keyFor(userId), null)) : EMPTY_STREAK,
    });
  },

  complete: (planKey, day, today) => {
    const { userId, data } = get();
    if (!userId) return;
    const next = completeDay(data, planKey, day, today);
    storage.set(keyFor(userId), next);
    set({ data: next });
  },
}));
