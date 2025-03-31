'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { PlusCircle, Loader2, History, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday } from 'date-fns'

interface ChatSidebarProps {
  activeChatId: string | null
  onChatSelected: (chatId: string) => void
  onNewChat: () => void
  chatbotId: string
  refreshTrigger?: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileView?: boolean
  onCloseMobile?: () => void
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
  refreshTrigger = 0,
  isCollapsed = false,
  onToggleCollapse,
  isMobileView = false,
  onCloseMobile
}: ChatSidebarProps) {
  const { user } = useAuth()
  const [chats, setChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastFetch, setLastFetch] = useState<number>(0)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  // Fetch chat history when the component mounts or when explicitly refreshed
  useEffect(() => {
    if (user) {
      const now = Date.now()
      // Only fetch if we haven't fetched recently or if refreshTrigger has changed
      if (now - lastFetch > CACHE_DURATION || refreshTrigger > 0) {
        fetchChats()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setLastFetch(Date.now())
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
    // Use the local date string to ensure correct timezone handling
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    
    groups[dateKey].push(chat)
    return groups
  }, {})

  // Format date for display
  const formatDateHeading = (dateKey: string) => {
    const date = new Date(dateKey + 'T00:00:00') // Add time component to ensure consistent timezone handling
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  }

  if (!user) {
    return null
  }
  
  return (
    <div className={cn(
      "h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 relative",
      isCollapsed ? "w-0 overflow-hidden" : "w-64"
    )}>
      {/* Close/Collapse button - shown when sidebar is expanded */}
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={isMobileView ? onCloseMobile : onToggleCollapse}
          className="absolute right-0 top-4 -mr-3 z-40 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <ChevronLeft size={12} />
        </Button>
      )}
      
      {/* Header with New Chat button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        {isCollapsed ? (
          <Button 
            onClick={onNewChat} 
            variant="outline" 
            size="icon"
            className="w-full aspect-square"
          >
            <PlusCircle size={16} />
          </Button>
        ) : (
          <Button 
            onClick={onNewChat} 
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <PlusCircle size={16} />
            New Chat
          </Button>
        )}
      </div>
      
      {/* Chat history list */}
      {!isCollapsed ? (
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
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col items-center pt-4">
          {chats.length > 0 && 
            <div className="space-y-2 w-full">
              {chats.slice(0, 5).map(chat => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelected(chat.id)}
                  className={cn(
                    "w-full flex justify-center py-1",
                    chat.id === activeChatId 
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <History size={16} />
                </button>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  )
}