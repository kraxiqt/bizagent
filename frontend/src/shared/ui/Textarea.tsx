import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type FormEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/shared/lib/cn';
import { fieldClasses } from './Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  autoResize?: boolean;
  maxHeight?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, autoResize = false, maxHeight = 200, className, onInput, value, rows = 2, ...props },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const resize = () => {
    const el = innerRef.current;
    if (!autoResize || !el) return;
    el.style.height = 'auto';
    // scrollHeight не включает рамку; без неё поле оказывалось на пару пикселей ниже текста и «прокручивалось»
    const borders = el.offsetHeight - el.clientHeight;
    const full = el.scrollHeight + borders;
    el.style.height = `${Math.min(full, maxHeight)}px`;
    el.style.overflowY = full > maxHeight ? 'auto' : 'hidden';
  };

  // controlled: пересчёт при программном изменении значения (например, очистка после отправки)
  useEffect(resize, [value, autoResize, maxHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    resize();
    onInput?.(event);
  };

  return (
    <textarea
      ref={innerRef}
      value={value}
      rows={rows}
      aria-invalid={error ? true : undefined}
      onInput={handleInput}
      className={cn(
        fieldClasses,
        'py-2 leading-6',
        // у автоувеличивающегося поля полосу прокрутки не показываем: длинный текст листается колесом и курсором
        autoResize ? 'no-scrollbar resize-none overflow-y-hidden' : 'resize-y',
        error ? 'border-red-600 dark:border-red-500' : 'border-black dark:border-ink-600',
        className,
      )}
      {...props}
    />
  );
});
