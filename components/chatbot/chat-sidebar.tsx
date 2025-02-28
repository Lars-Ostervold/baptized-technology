// components/chatbot/chat-sidebar.tsx
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatSession } from "@/lib/chatbot/types"

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  isLoading: boolean
}

export default function ChatSidebar({
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  isLoading
}: ChatSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/20 h-full flex flex-col">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full flex items-center justify-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : chatSessions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground p-4">
            No chat history yet
          </p>
        ) : (
          <div className="space-y-1">
            {chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md truncate ${
                  activeChatId === session.id
                    ? "bg-primary/10 font-medium"
                    : "hover:bg-primary/5"
                }`}
              >
                {session.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}