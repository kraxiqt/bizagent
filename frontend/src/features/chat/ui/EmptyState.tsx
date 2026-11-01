interface EmptyStateProps {
  // оставлено, чтобы MessageList и ChatPage не менялись; сейчас подсказок-кнопок нет
  onExamplePick?: (text: string) => void;
}

export function EmptyState(_props: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
      <div>
        <h2 className="font-display text-3xl font-medium">Чем помочь?</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Напишите вопрос ниже.</p>
      </div>
    </div>
  );
}
