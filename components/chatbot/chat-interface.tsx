'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { nanoid } from 'nanoid'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source } from '@/lib/chatbot/types'
import { useAuth } from '@/components/auth/auth-provider'
import ChatSidebar from './chat-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function ChatInterface({ chatbotId = 'bibleproject' }) {  
  // Get the chatbot configuration based on the ID
  const config = getChatbotConfig(chatbotId)
  const [sources, setSources] = useState<Source[]>([])
  const { user } = useAuth()
  // Chat session state
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isMobileView] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshChatTrigger, setRefreshChatTrigger] = useState(0)


  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    handleSubmit: originalHandleSubmit,
    status,
    setMessages,
  } = useChat({
    api: `/api/chat/${chatbotId}`,
    initialMessages: [
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ],
    id: activeChatId || undefined,
  })
  
  const [previousStatus, setPreviousStatus] = useState(status)

  // Add this useEffect to monitor status changes
  useEffect(() => {
    // Check if we've just finished streaming (was streaming before, now complete)
    if (previousStatus === 'streaming' && (status === 'ready')) {
      if (user && activeChatId && messages.length > 0) {
        fetch(`/api/chats/${activeChatId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: messages.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
            }))
          }),
        }).catch(error => {
          console.error('Error updating chat messages:', error)
        })
      }
    }
    
    // Update previous status for next comparison
    setPreviousStatus(status)
  }, [status, messages, user, activeChatId, previousStatus])

  const handleChatSelected = async (chatId: string) => {
    setActiveChatId(chatId)
    
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      
      if (response.ok) {
        const chatData = await response.json()
        
        // Reset the chat with the loaded messages
        if (chatData.messages && chatData.messages.length > 0) {
          setMessages(chatData.messages)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const handleNewChat = () => {
    // Clear the current messages except system message
    setMessages([
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ])
    
    // Clear active chat ID
    setActiveChatId(null)
    
    // On mobile, close the sidebar after selecting new chat
    if (isMobileView) {
      setSidebarOpen(false)
    }
  }


  const handleExampleClick = (example: string) => {
    handleInputChange({ target: { value: example } } as React.ChangeEvent<HTMLInputElement>)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't do anything if no input or already loading
    if (!input.trim() || isLoading) return
    
    try {
      // If user is logged in but no active chat, create a new chat session
      if (user && !activeChatId) {
        try {
          const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: input.slice(0, 50), // Use first message as title
              chatbotId: config.vectorNamespace,
              messages: [
                { id: nanoid(), role: 'system', content: config.systemPrompt }
              ]
            }),
          })
          
          if (response.ok) {
            const { id } = await response.json()
            setActiveChatId(id)
            setRefreshChatTrigger(prev => prev + 1)
          }
        } catch (error) {
          console.error('Error creating chat session:', error)
        }
      }

      // First, retrieve relevant sources
      const sourcesResponse = await fetch(`/api/sources/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      
      const { sources: retrievedSources, contextText } = await sourcesResponse.json()
      
      // Store sources for UI display
      setSources(retrievedSources || [])
      
      // Create augmented user message with context if available
      const augmentedMessages = [...messages]
      
      // Add the user's new message
      const userMessageId = nanoid()
      augmentedMessages.push({
        id: userMessageId,
        role: 'user',
        content: input,
        parts: [{ type: 'text', text: input }]
      })
      
      // If we have context, add it to the system message
      if (contextText) {
        // Find existing system message
        const systemIndex = augmentedMessages.findIndex(msg => msg.role === 'system')
        
        if (systemIndex !== -1) {
          // Replace system message with augmented version
          augmentedMessages[systemIndex] = {
            ...augmentedMessages[systemIndex],
            content: `${config.systemPrompt}\n\nUse this information to answer the question. If the information doesn't contain the answer, use your general knowledge but acknowledge this.\n\nContext:\n${contextText}`
          }
        }
      }
      
      // Submit to the chat API with updated messages
      originalHandleSubmit(e, {
        body: {
          messages: augmentedMessages
        }
      })
      
    } catch (error) {
      console.error("Error fetching sources:", error)
      // If source retrieval fails, still send the regular chat message
      originalHandleSubmit(e)
    }
  }

  return (
    <div className="flex h-full w-full relative">
      {/* Mobile sidebar toggle */}
      {user && isMobileView && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 left-2 z-20 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={18} />
        </Button>
      )}
      
      {/* Sidebar for chat history */}
      {user && ((!isMobileView) || sidebarOpen) && (
        <div className={`${isMobileView ? "absolute z-10 h-full" : ""}`}>
          <ChatSidebar 
            activeChatId={activeChatId}
            onChatSelected={handleChatSelected}
            onNewChat={handleNewChat}
            chatbotId={config.vectorNamespace}
            refreshTrigger={refreshChatTrigger}
          />
        </div>
      )}
      
      {/* Main chat area with messages */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden ${user && !isMobileView ? "ml-0" : ""}`}>
        <ChatMessages 
          messages={messages} 
          status={status} 
          welcomeMessage={config.welcomeMessage}
          examples={config.examples}
          onExampleClick={handleExampleClick}
          sources={sources}
        />
      </div>
      
      {/* Floating input at bottom */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ring-1 ring-slate-200 dark:ring-slate-700">
            <ChatInput 
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              status={status}
              placeholder={config.placeholderText}
            />
          </div>
        </div>
      </div>
    </div>
  )
}