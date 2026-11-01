import { cn } from '@/shared/lib/cn';

interface FlameIconProps {
  // true — горит (оранжевый), false — погас (серый)
  lit: boolean;
  className?: string;
}

export function FlameIcon({ lit, className }: FlameIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-5 w-5 shrink-0', className)}>
      <path
        d="M12 2c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.2 1.5 1 2.5 2 2.5 0-3-1-5 1-8z"
        fill={lit ? '#ff6a00' : '#d6d3d1'}
      />
      <path
        d="M12 22a3.2 3.2 0 0 1-3.2-3.2c0-1.6 1.2-2.4 1.9-3.4.5.9 1.1 1.2 1.6 1.2.9-1 .6-2.1.9-3 .9 1 2 2.2 2 4.2A3.2 3.2 0 0 1 12 22z"
        fill={lit ? '#ffd000' : '#e7e5e4'}
      />
    </svg>
  );
}
