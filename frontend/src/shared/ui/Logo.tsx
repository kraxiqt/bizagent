import { env } from '@/shared/config/env';
import { cn } from '@/shared/lib/cn';

export type LogoSize = 'sm' | 'lg';

interface LogoProps {
  size?: LogoSize;
  align?: 'left' | 'center';
  className?: string;
}

const sizes: Record<LogoSize, string> = {
  sm: 'text-sm',
  lg: 'text-3xl sm:text-[34px]',
};

// Название из одного слова («Verity») крупнее: оно занимает одну строку вместо двух.
const singleWordSizes: Record<LogoSize, string> = {
  sm: 'text-2xl',
  lg: 'text-5xl sm:text-6xl',
};

// Название сверху: первое слово обычным регистром, остальные слова (если есть) — заглавными второй строкой.
// Текст берётся из env.APP_NAME.
export function Logo({ size = 'lg', align = 'center', className }: LogoProps) {
  const [first, ...rest] = env.APP_NAME.trim().split(/\s+/);
  const second = rest.join(' ');

  return (
    <span
      className={cn(
        'inline-block font-display font-bold leading-tight text-[#0015ff]',
        second ? sizes[size] : cn(singleWordSizes[size], 'tracking-tight'),
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      <span className="block">{first}</span>
      {second && <span className="block uppercase">{second}</span>}
    </span>
  );
}
