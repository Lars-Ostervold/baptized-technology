'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { nanoid } from 'nanoid'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source } from '@/lib/chatbot/types'

export default function ChatInterface({ chatbotId = 'bibleproject' }) {  
  // Get the chatbot configuration based on the ID
  const config = getChatbotConfig(chatbotId)
  const [sources, setSources] = useState<Source[]>([])
  
  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    handleSubmit: originalHandleSubmit,
    status,
  } = useChat({
    api: `/api/chat/${chatbotId}`,
    initialMessages: [
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ]
  })

  const handleExampleClick = (example: string) => {
    handleInputChange({ target: { value: example } } as React.ChangeEvent<HTMLInputElement>)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't do anything if no input or already loading
    if (!input.trim() || isLoading) return
    
    try {
      // First, retrieve relevant sources
      const sourcesResponse = await fetch(`/api/sources/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      
      const { sources: retrievedSources, contextText } = await sourcesResponse.json()

      console.log("Retrieved sources:", retrievedSources)
      
      // Store sources for UI display
      setSources(retrievedSources || [])
      
      // Create augmented user message with context if available
      //eslint-disable-next-line prefer-const
      let augmentedMessages = [...messages]
      
      // Add the user's new message
      augmentedMessages.push({
        id: nanoid(),
        role: 'user',
        content: input
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
        options: {
          body: {
            messages: augmentedMessages
          }
        }
      })
    } catch (error) {
      console.error("Error fetching sources:", error)
      // If source retrieval fails, still send the regular chat message
      originalHandleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Main chat area with messages */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
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