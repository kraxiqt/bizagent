import { cn } from '@/shared/lib/cn';
import { useStreak } from '../model/hooks';
import { lastDays, pluralDays } from '../model/streak';
import { FlameIcon } from './FlameIcon';

// Карточка серии в левой панели чата: число дней, рекорд, неделя огоньков и подсказка, что делать дальше.
export function StreakCard({ className }: { className?: string }) {
  const { data, today, status } = useStreak();
  const week = lastDays(data.dates, today, 7);

  const hint = status.doneToday
    ? 'Огонёк на сегодня горит. Возвращайтесь завтра, чтобы поддержать серию!'
    : status.atRisk
      ? `Выполните день плана сегодня, иначе серия в ${status.current} ${pluralDays(status.current)} сгорит.`
      : status.best > 0
        ? 'Серия прервалась. Выполните день плана и начните новую!'
        : 'Выполните первый день плана, чтобы зажечь огонёк.';

  return (
    <section
      aria-label="Серия обучения"
      className={cn('rounded-[4px] border-2 border-black p-3 shadow-hard-sm dark:border-ink-600', className)}
    >
      <div className="flex items-center gap-2">
        <FlameIcon lit={status.doneToday || status.atRisk} className="h-9 w-9" />
        <div className="min-w-0">
          <p className="font-display text-xl font-bold leading-tight">
            {status.current} {pluralDays(status.current)} подряд
          </p>
          <p className="text-xs opacity-70">Рекорд: {status.best} {pluralDays(status.best)}</p>
        </div>
      </div>

      <ol className="mt-3 grid grid-cols-7 gap-1">
        {week.map((d) => (
          <li
            key={d.key}
            className={cn(
              'flex flex-col items-center rounded-[4px] py-1',
              d.isToday && 'bg-brand-50 ring-2 ring-brand-600 dark:bg-ink-900',
            )}
          >
            <span className="font-display text-xs">{d.label}</span>
            <FlameIcon lit={d.active} className="h-5 w-5" />
            <span className="sr-only">{d.active ? 'огонёк есть' : 'огонька нет'}</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-sm leading-snug">{hint}</p>
    </section>
  );
}
