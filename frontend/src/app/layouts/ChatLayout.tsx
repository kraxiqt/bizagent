import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import {
  ChatHeader,
  ChatSidebar,
  PANEL_LIMITS,
  panelMax,
  useChat,
  useChatHistorySync,
  usePanelsStore,
} from '@/features/chat';
import { GoalBanner } from '@/features/quiz';
import { StreakCard, useStreakSync } from '@/features/streak';
import { useViewportWidth } from '@/shared/lib/useViewportWidth';
import { ResizeHandle } from '@/shared/ui';

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

//Хедер чата + боковая панель с историей
export function ChatLayout() {
  const {
    conversation,
    messages,
    history,
    isGenerating,
    startNewConversation,
    openConversation,
    deleteConversation,
  } = useChat();

  // история хранится на бэкенде: загружаем её для текущего пользователя
  const userId = useAuthStore((s) => s.user?.id ?? null);
  useChatHistorySync(userId);
  // серия «огоньков» хранится отдельно для каждого пользователя
  useStreakSync(userId);

  // ширина боковых панелей: история слева меняется ручкой, значение запоминается
  const viewport = useViewportWidth();
  const historyWidth = usePanelsStore((s) => s.historyWidth);
  const planWidth = usePanelsStore((s) => s.planWidth);
  const setWidth = usePanelsStore((s) => s.setWidth);
  const resetWidth = usePanelsStore((s) => s.resetWidth);
  const historyMax = panelMax('history', viewport, planWidth);
  const historyShown = Math.min(historyWidth, historyMax);

  // на десктопе панель открыта по умолчанию, на телефоне — закрыта
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  // на телефоне после выбора закрываем панель
  const closeOnMobile = () => {
    if (!isDesktop()) setSidebarOpen(false);
  };

  // активный диалог показываем в списке, только если в нём уже есть сообщения
  const items = useMemo(() => {
    const all = history.map((c) => ({ ...c.conversation }));
    if (messages.length) all.push(conversation);
    return all
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ id, title }) => ({ id, title }));
  }, [history, messages.length, conversation]);

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        title={conversation.title}
        disabled={isGenerating}
        onNewConversation={startNewConversation}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="relative flex min-h-0 flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <ChatSidebar
          className={sidebarOpen ? 'fixed inset-y-0 left-0 z-30 flex md:static md:z-auto' : 'hidden'}
          items={items}
          activeId={conversation.id}
          width={historyShown}
          footer={
            <>
              <GoalBanner userId={userId} />
              <StreakCard />
            </>
          }
          disabled={isGenerating}
          onSelect={(id) => {
            if (id !== conversation.id) openConversation(id);
            closeOnMobile();
          }}
          onDelete={deleteConversation}
          onNew={() => {
            startNewConversation();
            closeOnMobile();
          }}
        />

        {sidebarOpen && (
          <ResizeHandle
            edge="right"
            label="Ширина истории чатов"
            width={historyShown}
            min={PANEL_LIMITS.history.min}
            max={historyMax}
            onChange={(value) => setWidth('history', value)}
            onReset={() => resetWidth('history')}
            className="hidden md:block"
          />
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}