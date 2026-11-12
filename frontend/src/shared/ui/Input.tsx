import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// Общие классы для текстовых полей на светлом фоне (используются в Textarea чата).
export const fieldClasses =
  'w-full rounded-[4px] border-2 bg-white px-3 text-base text-ink-900 placeholder:text-ink-400 transition-colors ' +
  'dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

// Поле для красной карточки входа/регистрации: тёмная заливка, белые подписи.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="font-display text-lg text-white">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'auth-input h-11 w-full rounded-none border-0 bg-navy px-3 font-display text-lg text-white',
          'placeholder:text-white/40 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60',
          error && 'ring-2 ring-white',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="bg-white px-2 py-1 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-white/70">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
