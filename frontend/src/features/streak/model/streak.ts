// Чистая логика серии «огоньков»: без React и браузерных API, чтобы её было легко проверять.
//
// Правила:
//  - день обучения = один день плана; за него ставится огонёк на ТЕКУЩУЮ календарную дату;
//  - в один календарный день засчитывается только один день плана (следующий — завтра);
//  - дни плана выполняются по порядку;
//  - серия — число календарных дней подряд с огоньком; если вчера огонька не было, серия сгорает.

export interface StreakData {
  // даты (YYYY-MM-DD, местное время), в которые выполнен день плана
  dates: string[];
  // выполненные дни плана: ключ плана -> номера дней
  completed: Record<string, number[]>;
}

export const EMPTY_STREAK: StreakData = { dates: [], completed: {} };

export interface StreakStatus {
  current: number;
  best: number;
  doneToday: boolean;
  // серия жива (вчера был огонёк), но сегодня день ещё не выполнен
  atRisk: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function shiftDate(key: string, days: number): string {
  const t = parseKey(key);
  t.setUTCDate(t.getUTCDate() + days);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export function weekdayLabel(key: string): string {
  return WEEKDAYS[parseKey(key).getUTCDay()];
}

export function getStreakStatus(dates: string[], today: string): StreakStatus {
  const set = new Set(dates);
  const doneToday = set.has(today);
  const yesterday = shiftDate(today, -1);

  let current = 0;
  let cursor: string | null = doneToday ? today : set.has(yesterday) ? yesterday : null;
  while (cursor && set.has(cursor)) {
    current += 1;
    cursor = shiftDate(cursor, -1);
  }

  // лучшая серия за всё время
  const sorted = [...set].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    run = prev && shiftDate(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }

  return { current, best, doneToday, atRisk: !doneToday && current > 0 };
}

// Последние n дней, заканчивая сегодняшним, — для полоски недели.
export function lastDays(dates: string[], today: string, n = 7) {
  const set = new Set(dates);
  return Array.from({ length: n }, (_, i) => {
    const key = shiftDate(today, i - (n - 1));
    return { key, label: weekdayLabel(key), active: set.has(key), isToday: key === today };
  });
}

// Ключ плана: у плана с бэкенда нет id, поэтому берём отпечаток его содержимого.
export function planKeyOf(plan: { summary: string; days: { day: number; topic: string }[] }): string {
  const source = `${plan.summary}|${plan.days.map((d) => `${d.day}:${d.topic}`).join(';')}`;
  let hash = 5381;
  for (let i = 0; i < source.length; i += 1) hash = ((hash << 5) + hash + source.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(36);
}

export type CompleteBlock = 'done' | 'order' | 'today';

// Можно ли отметить день выполненным; если нет — почему.
export function getCompleteBlock(
  data: StreakData,
  planKey: string,
  day: number,
  allDays: number[],
  today: string,
): CompleteBlock | null {
  const done = data.completed[planKey] ?? [];
  if (done.includes(day)) return 'done';
  if (allDays.some((d) => d < day && !done.includes(d))) return 'order';
  if (data.dates.includes(today)) return 'today';
  return null;
}

export function completeDay(data: StreakData, planKey: string, day: number, today: string): StreakData {
  const done = data.completed[planKey] ?? [];
  return {
    dates: data.dates.includes(today) ? data.dates : [...data.dates, today],
    completed: { ...data.completed, [planKey]: done.includes(day) ? done : [...done, day] },
  };
}

// Данные из localStorage могли испортиться — приводим к безопасному виду.
export function normalizeStreak(raw: unknown): StreakData {
  if (!raw || typeof raw !== 'object') return EMPTY_STREAK;
  const { dates, completed } = raw as Partial<StreakData>;
  const cleanDates = Array.isArray(dates)
    ? dates.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
    : [];
  const cleanCompleted: Record<string, number[]> = {};
  if (completed && typeof completed === 'object') {
    for (const [key, days] of Object.entries(completed)) {
      if (Array.isArray(days)) cleanCompleted[key] = days.filter((d): d is number => Number.isInteger(d));
    }
  }
  return { dates: cleanDates, completed: cleanCompleted };
}

export function pluralDays(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'дней';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
}
