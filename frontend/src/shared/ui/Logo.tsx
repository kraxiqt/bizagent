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

// Название сверху: первое слово обычным регистром, остальное — заглавными (как на макете).
// Текст берётся из VITE_APP_NAME.
export function Logo({ size = 'lg', align = 'center', className }: LogoProps) {
  const [first, ...rest] = env.APP_NAME.trim().split(/\s+/);
  const second = rest.join(' ');

  return (
    <span
      className={cn(
        'inline-block font-display font-bold leading-tight text-[#0015ff]',
        sizes[size],
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      <span className="block">{first}</span>
      {second && <span className="block uppercase">{second}</span>}
    </span>
  );
}
