// Update to chat-sidebar.tsx
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatSession } from "@/lib/chatbot/types"
import { formatDistanceToNow } from 'date-fns'
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  
  const handleDeleteChat = async () => {
    if (!chatToDelete) return
    
    try {
      const response = await fetch(`/api/chats/${chatToDelete}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // If we're deleting the active chat, create a new one
        if (chatToDelete === activeChatId) {
          onNewChat()
        }
        
        // Refresh the chat list (this will be handled by the parent component)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
    
    setChatToDelete(null)
    setDeleteDialogOpen(false)
  }
  
  const openDeleteDialog = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    setChatToDelete(chatId)
    setDeleteDialogOpen(true)
  }
  
  return (
    <div className="w-64 bg-muted/20 h-full flex flex-col">
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
              <div
                key={session.id}
                className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center group ${
                  activeChatId === session.id
                    ? "bg-primary/10 font-medium"
                    : "hover:bg-primary/5"
                }`}
              >
                <button
                  onClick={() => onSelectChat(session.id)}
                  className="flex-1 text-left truncate flex flex-col"
                >
                  <span className="truncate">{session.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </span>
                </button>
                <button 
                  onClick={(e) => openDeleteDialog(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}