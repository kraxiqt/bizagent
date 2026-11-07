import { create } from 'zustand';
import { storage } from '@/shared/lib/storage';

// Цель, которую пользователь ввёл в тесте. Хранится в браузере отдельно для каждого пользователя.
const keyFor = (userId: string) => `goal:${userId}`;

interface GoalState {
  userId: string | null;
  goal: string;
  load: (userId: string | null) => void;
  set: (userId: string, goal: string) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  userId: null,
  goal: '',

  load: (userId) => {
    const saved = userId ? storage.get<string>(keyFor(userId), '') : '';
    set({ userId, goal: typeof saved === 'string' ? saved : '' });
  },

  set: (userId, goal) => {
    storage.set(keyFor(userId), goal);
    set({ userId, goal });
  },
}));
