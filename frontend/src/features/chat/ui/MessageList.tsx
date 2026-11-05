import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { Message } from './types';
import { EmptyState } from './EmptyState';
import { MessageBubble } from './MessageBubble';

// Если до низа осталось меньше этого (px), считаем, что читатель «у конца» и ответ нужно догонять.
const STICK_THRESHOLD = 80;

interface MessageListProps {
  messages: Message[];
  onExamplePick?: (text: string) => void;
}

export function MessageList({ messages, onExamplePick }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // true, пока читатель у конца диалога: тогда окно само едет за печатающимся ответом
  const stickRef = useRef(true);

  const hasMessages = messages.length > 0;
  // последнее сообщение пользователя: меняется при отправке и при открытии другого диалога
  const lastUserId = [...messages].reverse().find((m) => m.role === 'user')?.id;

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickRef.current = gap < STICK_THRESHOLD;
  };

  // Пользователь отправил сообщение или открыл диалог — всегда показываем конец.
  useLayoutEffect(() => {
    stickRef.current = true;
    scrollToBottom();
  }, [lastUserId, scrollToBottom]);

  // Каждое «довешенное» слово ответа: если читатель у конца, едем вниз.
  useLayoutEffect(() => {
    if (stickRef.current) scrollToBottom();
  }, [messages, scrollToBottom]);

  // Высота содержимого меняется и без новых сообщений (Markdown дорисовался, блок кода раскрылся).
  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => {
      if (stickRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [hasMessages, scrollToBottom]);

  if (!hasMessages) {
    return <EmptyState onExamplePick={onExamplePick} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* полоса прокрутки у края всей центральной области, а не посреди экрана */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-brand min-h-0 flex-1 overflow-y-auto px-4"
      >
        <div ref={contentRef} className="mx-auto w-full max-w-3xl space-y-4 py-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}
