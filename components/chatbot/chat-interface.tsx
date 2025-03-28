'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { nanoid } from 'nanoid'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source, ExtendedMessage } from '@/lib/chatbot/types'
import { useAuth } from '@/components/auth/auth-provider'
import ChatSidebar from './chat-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function ChatInterface({ chatbotId = 'bibleproject' }) {  
  // Get the chatbot configuration based on the ID
  const config = getChatbotConfig(chatbotId)
  const [currentMessageSources, setCurrentMessageSources] = useState<Source[]>([])
  const { user } = useAuth()
  // Chat session state
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isMobileView] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshChatTrigger, setRefreshChatTrigger] = useState(0)

  const {
    messages: originalMessages,
    input,
    handleInputChange,
    isLoading,
    handleSubmit: originalHandleSubmit,
    status,
    setMessages: setOriginalMessages,
  } = useChat({
    api: `/api/chat/${chatbotId}`,
    initialMessages: [
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ],
    id: activeChatId || undefined,
  })
  
  // Use a state to track messages with sources
  const [messagesWithSources, setMessagesWithSources] = useState<ExtendedMessage[]>([]);
  
  // Keep messagesWithSources in sync with messages
  useEffect(() => {
    const updatedMessages = originalMessages.map(msg => {
      // Find if we have this message in our messagesWithSources array
      const existingMsg = messagesWithSources.find(m => m.id === msg.id);
      
      // If it exists and has sources, keep them
      if (existingMsg && (existingMsg as ExtendedMessage).sources) {
        return {
          ...msg,
          sources: (existingMsg as ExtendedMessage).sources
        };
      }
      
      // For the latest assistant message, add current sources
      if (
        msg.role === 'assistant' && 
        msg.id === originalMessages[originalMessages.length - 1]?.id && 
        currentMessageSources.length > 0
      ) {
        return {
          ...msg,
          sources: currentMessageSources
        };
      }
      
      return msg;
    });
    
    setMessagesWithSources(updatedMessages as ExtendedMessage[]);
  }, [originalMessages, currentMessageSources]);

  const [previousStatus, setPreviousStatus] = useState(status)

  // Add this useEffect to monitor status changes
  useEffect(() => {
    // Check if we've just finished streaming (was streaming before, now complete)
    if (previousStatus === 'streaming' && (status === 'ready')) {
      if (user && activeChatId && messagesWithSources.length > 0) {
        fetch(`/api/chats/${activeChatId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: messagesWithSources.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              sources: msg.sources, // Include sources in the saved data
            }))
          }),
        }).catch(error => {
          console.error('Error updating chat messages:', error)
        })
      }
    }
    
    // Update previous status for next comparison
    setPreviousStatus(status)
  }, [status, messagesWithSources, user, activeChatId, previousStatus])

  const handleChatSelected = async (chatId: string) => {
    setActiveChatId(chatId)
    
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      
      if (response.ok) {
        const chatData = await response.json()
        
        // Reset the chat with the loaded messages (which now include sources)
        if (chatData.messages && chatData.messages.length > 0) {
          setOriginalMessages(chatData.messages)
          setMessagesWithSources(chatData.messages)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const handleNewChat = () => {
    // Clear the current messages except system message
    const systemMessage = { 
      id: nanoid(), 
      role: "system" as const, 
      content: config.systemPrompt 
    };
    
    setOriginalMessages([systemMessage])
    setMessagesWithSources([systemMessage])
    setCurrentMessageSources([])
    
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

      // Create a cleaned chat history for context
      const chatHistory = messagesWithSources
        .filter(msg => msg.role === 'user' || msg.role === 'assistant') // Only user and assistant messages
        .map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content : ''
        }))
        .slice(-6) // Use last 6 messages for context (3 exchanges)

      // First, retrieve relevant sources
      const sourcesResponse = await fetch(`/api/sources/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: input,
          chatHistory
        })
      })
      
      const { sources: retrievedSources, contextText, enhancedQuery } = await sourcesResponse.json()
      
      // Store sources for the upcoming message
      setCurrentMessageSources(retrievedSources || [])
      
      // Create augmented user message with context if available
      const augmentedMessages = [...messagesWithSources]
      
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
          // Add instructions for citation format to the system message
          augmentedMessages[systemIndex] = {
            ...augmentedMessages[systemIndex],
            content: `${config.systemPrompt}
            
Use this information to answer the question. If the information doesn't contain the answer, use your general knowledge but acknowledge this.

IMPORTANT: You MUST cite your sources using [1], [2], etc. format as you write. Place citations immediately after any information drawn from sources. You may cite multiple sources for a single statement like [1][2]. Your citations do not have to be in order, you can go [1], [4], [2], etc. or [2], [1], [4], etc. as long as you use [1] and [2] at some point. Don't include any explanation of the citations - just use the bracket notation. You'll have ${retrievedSources.length} sources available.

Context:
${contextText}`
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
          messages={messagesWithSources} 
          status={status} 
          welcomeMessage={config.welcomeMessage}
          examples={config.examples}
          onExampleClick={handleExampleClick}
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