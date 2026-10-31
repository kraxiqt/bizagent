import { ChatInput, MessageList, useChat } from "@/features/chat";
import { PlanPanel } from "./PlanPanel";
export function ChatPage() {
  const { messages, isGenerating, sendMessage, stopGeneration } = useChat();

  return (
    <div className="flex h-full min-h-0">
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <MessageList messages={messages} onExamplePick={sendMessage} />
        <ChatInput
          isGenerating={isGenerating}
          onSend={sendMessage}
          onAbort={stopGeneration}
        />
      </div>
      <PlanPanel />
    </div>
  );
}
