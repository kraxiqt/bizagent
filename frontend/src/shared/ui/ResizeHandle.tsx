import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '@/shared/lib/cn';

interface ResizeHandleProps {
  // текущая ширина панели и допустимые границы, px
  width: number;
  min: number;
  max: number;
  // 'right' — ручка на правом краю панели (панель слева); 'left' — на левом краю (панель справа)
  edge: 'left' | 'right';
  label: string;
  onChange: (width: number) => void;
  // двойной клик возвращает ширину по умолчанию
  onReset?: () => void;
  className?: string;
}

const KEY_STEP = 16;

// Вертикальная «ручка» между панелью и остальным экраном: тянется мышью/пальцем, меняется стрелками.
export function ResizeHandle({ width, min, max, edge, label, onChange, onReset, className }: ResizeHandleProps) {
  const drag = useRef<{ x: number; width: number } | null>(null);
  // тянем вправо: левая панель растёт, правая сужается
  const sign = edge === 'right' ? 1 : -1;
  const clamp = (value: number) => Math.max(min, Math.min(max, value));

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, width };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    onChange(clamp(drag.current.width + sign * (event.clientX - drag.current.x)));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    onChange(clamp(width + direction * sign * KEY_STEP));
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      title="Потяните, чтобы изменить ширину. Двойной клик — вернуть по умолчанию"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onDoubleClick={onReset}
      className={cn('group relative z-10 w-1.5 shrink-0 cursor-col-resize touch-none select-none outline-none', className)}
    >
      <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-transparent transition-colors group-hover:bg-brand-600 group-focus-visible:bg-brand-600 group-active:bg-brand-600" />
    </div>
  );
}
