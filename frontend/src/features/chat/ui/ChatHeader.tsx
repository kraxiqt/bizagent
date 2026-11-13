import type { ReactNode } from 'react';
import { useTheme } from '@/app/providers';
import { UserAvatar } from '@/entities/user';
import { LogoutButton, useAuth } from '@/features/auth';
import { Button, IconButton, Logo } from '@/shared/ui';

const SunIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const MenuIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface ChatHeaderProps {
  title: string;
  disabled?: boolean;
  onNewConversation: () => void;
  onToggleSidebar?: () => void;
  // дополнительный элемент справа (например, значок серии)
  extra?: ReactNode;
}

export function ChatHeader({ title, disabled = false, onNewConversation, onToggleSidebar, extra }: ChatHeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex shrink-0 items-center border-b-4 border-brand-950 bg-brand-600 px-4 py-2 text-white dark:border-brand-950 sm:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onToggleSidebar && (
            <IconButton
              size="sm"
              label="История чатов"
              icon={MenuIcon}
              onClick={onToggleSidebar}
              className="text-white hover:bg-brand-700 dark:text-white dark:hover:bg-brand-700"
            />
          )}
          <Logo size="sm" align="left" className="shrink-0" />
          <span className="hidden truncate text-sm text-white/80 sm:inline">{title}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {extra}
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewConversation}
            disabled={disabled}
            title={disabled ? 'Дождитесь ответа или остановите генерацию' : undefined}
          >
            Новый диалог
          </Button>
          <IconButton
            size="sm"
            label={resolvedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            icon={resolvedTheme === 'dark' ? SunIcon : MoonIcon}
            onClick={toggleTheme}
            className="text-white hover:bg-brand-700 dark:text-white dark:hover:bg-brand-700"
          />
          {user && (
            <span className="hidden sm:inline-flex">
              <UserAvatar name={user.name} email={user.email} size="sm" />
            </span>
          )}
          <LogoutButton className="text-white hover:bg-brand-700 dark:text-white dark:hover:bg-brand-700" />
        </div>
      </div>
    </div>
  );
}
