'use client'

import { useChat } from '@ai-sdk/react'
import { nanoid } from 'nanoid'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { getChatbotConfig } from '@/lib/chatbot/config'

export default function ChatInterface({ chatbotId = 'bibleproject' }) {  
  // Get the chatbot configuration based on the ID
  const config = getChatbotConfig(chatbotId)
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  } = useChat({
    api: `/api/chat/${chatbotId}`,
    initialMessages: [
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ]
  })

  const handleExampleClick = (example: string) => {
    handleInputChange({ target: { value: example } } as any)
    handleSubmit({ preventDefault: () => {} } as any)
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