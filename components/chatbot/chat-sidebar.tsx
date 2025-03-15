'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { PlusCircle, Loader2, History, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday } from 'date-fns'

interface ChatSidebarProps {
  activeChatId: string | null
  onChatSelected: (chatId: string) => void
  onNewChat: () => void
  chatbotId: string
  refreshTrigger?: number
}

interface ChatSession {
  id: string
  title: string
  user_id: string
  chatbot_id: string
  messages: {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[]
  created_at: string
  updated_at: string
}

export default function ChatSidebar({ 
  activeChatId, 
  onChatSelected, 
  onNewChat,
  chatbotId,
  refreshTrigger = 0
}: ChatSidebarProps) {
  const { user } = useAuth()
  const [chats, setChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Fetch chat history when the component mounts
  useEffect(() => {
    if (user) {
      fetchChats()
    }
  }, [user, refreshTrigger])
  
  const fetchChats = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/chats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history')
      }
      
      const data = await response.json()
      setChats(data.filter((chat: ChatSession) => chat.chatbot_id === chatbotId))
    } catch (err) {
      setError("Error loading chat history")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Group chats by date
  const groupedChats = chats.reduce<Record<string, ChatSession[]>>((groups, chat) => {
    const date = new Date(chat.updated_at)
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    
    groups[dateKey].push(chat)
    return groups
  }, {})

  // Format date for display
  const formatDateHeading = (dateKey: string) => {
    const date = new Date(dateKey);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  }

  if (!user) {
    return null
  }
  
  return (
    <div className="w-64 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header with New Chat button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Button 
          onClick={onNewChat} 
          variant="outline" 
          className="w-full justify-start gap-2"
        >
          <PlusCircle size={16} />
          New Chat
        </Button>
      </div>
      
      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 p-4">
            {error}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center text-sm text-slate-500 dark:text-slate-400 p-4 text-center mt-8">
            <History className="h-10 w-10 mb-2 opacity-50" />
            No chat history yet
          </div>
        ) : (
          // Group chats by date
          Object.entries(groupedChats).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()).map(([dateKey, dateChats]) => (
            <div key={dateKey} className="mb-4">
              <div className="flex items-center gap-1 px-2 mb-1">
                <CalendarDays size={12} className="text-slate-400" />
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {formatDateHeading(dateKey)}
                </h3>
              </div>
              <div className="space-y-1">
                {dateChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => onChatSelected(chat.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm transition-colors truncate",
                      chat.id === activeChatId 
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {chat.title || "Untitled Chat"}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}