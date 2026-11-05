import { IconButton } from '@/shared/ui';

const StopIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

interface AbortButtonProps {
  onAbort: () => void;
}

// Значок «стоп» на месте кнопки отправки, пока бот печатает ответ.
export function AbortButton({ onAbort }: AbortButtonProps) {
  return (
    <IconButton label="Остановить" variant="secondary" size="md" icon={StopIcon} onClick={onAbort} className="h-11 w-11" />
  );
}
