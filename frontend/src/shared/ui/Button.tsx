import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonVariants: Record<ButtonVariant, string> = {
  // синяя кнопка с тёмной кромкой снизу («Далее», «Попробовать»)
  primary:
    'border-2 border-brand-950 bg-brand-600 text-white shadow-inset-hard hover:bg-brand-700',
  // белая с серой рамкой («Назад», «Новый диалог»)
  secondary:
    'border-2 border-[#666] bg-white text-ink-950 hover:bg-ink-100 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800',
  // белая кнопка на синей карточке (вход / регистрация)
  inverted: 'bg-white text-brand-600 text-shadow-navy hover:bg-brand-50',
  ghost:
    'text-ink-800 hover:bg-brand-50 dark:text-ink-300 dark:hover:bg-ink-800',
  danger:
    'bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500',
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-base',
  md: 'h-10 gap-2 px-4 text-base',
  lg: 'h-12 gap-2 px-6 text-lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    disabled,
    className,
    type = 'button',
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-[4px] font-display font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
    </button>
  );
});
