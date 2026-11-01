import { cn } from '@/shared/lib/cn';
import { useStreak } from '../model/hooks';
import { pluralDays } from '../model/streak';
import { FlameIcon } from './FlameIcon';

// Значок серии в шапке чата: огонёк и число дней подряд.
export function StreakBadge() {
  const { status } = useStreak();
  const { current, doneToday, atRisk } = status;

  const title = doneToday
    ? `Огонёк за сегодня горит. Серия: ${current} ${pluralDays(current)}`
    : atRisk
      ? `Серия ${current} ${pluralDays(current)} сгорит, если сегодня не выполнить день плана`
      : 'Выполните день плана, чтобы зажечь огонёк';

  return (
    <span
      role="status"
      title={title}
      aria-label={title}
      className={cn(
        'inline-flex h-8 items-center gap-1 rounded-[4px] border-2 px-2 font-display text-base font-bold',
        doneToday
          ? 'border-black bg-orange-50 text-ink-950 dark:bg-ink-900 dark:text-ink-100'
          : atRisk
            ? 'animate-pulse border-orange-500 bg-white text-ink-950 dark:bg-ink-900 dark:text-ink-100'
            : 'border-ink-300 text-ink-400 dark:border-ink-700',
      )}
    >
      <FlameIcon lit={doneToday || atRisk} className="h-4 w-4" />
      {current}
    </span>
  );
}
