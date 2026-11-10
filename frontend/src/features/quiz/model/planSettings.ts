import { storage } from '@/shared/lib/storage';

// Настройки плана (дни и часы в день), которые пользователь выбрал без квиза.
export interface PlanSettings {
  days: 7 | 14 | 30;
  hoursPerDay: number;
}

const keyFor = (userId: string) => `plan-settings:${userId}`;

export const savePlanSettings = (userId: string, settings: PlanSettings) =>
  storage.set(keyFor(userId), settings);

export const getPlanSettings = (userId: string): PlanSettings | null =>
  storage.get<PlanSettings | null>(keyFor(userId), null);
