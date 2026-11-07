import { useState, type KeyboardEvent } from 'react';
import { IconButton, Textarea } from '@/shared/ui';
import { AbortButton } from './AbortButton';

const SendIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

interface ChatInputProps {
  isGenerating: boolean;
  onSend: (content: string) => void;
  onAbort: () => void;
}

export function ChatInput({ isGenerating, onSend, onAbort }: ChatInputProps) {
  const [value, setValue] = useState('');
  const canSend = value.trim().length > 0 && !isGenerating;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter — отправить, Shift+Enter — перенос строки (ничего не перехватываем).
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mb-2 shrink-0 border-t-2 border-black py-3 dark:border-ink-700 sm:mb-4">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3 px-4">
        <Textarea
          autoResize
          maxHeight={160}
          rows={1}
          placeholder="Напишите сообщение… Enter — отправить, Shift+Enter — новая строка"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          aria-label="Сообщение"
        />
        {/* значок стоит справа от поля: отправить, а во время ответа — остановить */}
        {isGenerating ? (
          <AbortButton onAbort={onAbort} />
        ) : (
          <IconButton
            label="Отправить"
            variant="primary"
            size="md"
            icon={SendIcon}
            onClick={handleSend}
            disabled={!canSend}
            className="h-11 w-11 disabled:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
