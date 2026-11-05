import {
  ChatInput,
  MessageList,
  PANEL_LIMITS,
  panelMax,
  useChat,
  usePanelsStore,
} from "@/features/chat";
import { useViewportWidth } from "@/shared/lib/useViewportWidth";
import { ResizeHandle } from "@/shared/ui";
import { PlanPanel } from "./PlanPanel";
export function ChatPage() {
  const { messages, isGenerating, sendMessage, stopGeneration } = useChat();

  // ширина плана справа: тянется ручкой, значение запоминается
  const viewport = useViewportWidth();
  const historyWidth = usePanelsStore((s) => s.historyWidth);
  const planWidth = usePanelsStore((s) => s.planWidth);
  const setWidth = usePanelsStore((s) => s.setWidth);
  const resetWidth = usePanelsStore((s) => s.resetWidth);
  const planMax = panelMax("plan", viewport, historyWidth);
  const planShown = Math.min(planWidth, planMax);

  return (
    <div className="flex h-full min-h-0">
      {/* свободное место между историей и планом; сам диалог стоит по центру этого места */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <MessageList messages={messages} onExamplePick={sendMessage} />
        <ChatInput
          isGenerating={isGenerating}
          onSend={sendMessage}
          onAbort={stopGeneration}
        />
      </div>
      <ResizeHandle
        edge="left"
        label="Ширина плана"
        width={planShown}
        min={PANEL_LIMITS.plan.min}
        max={planMax}
        onChange={(value) => setWidth("plan", value)}
        onReset={() => resetWidth("plan")}
        className="hidden lg:block"
      />
      <PlanPanel width={planShown} />
    </div>
  );
}
