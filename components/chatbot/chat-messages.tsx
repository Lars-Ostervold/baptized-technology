'use client'

import { useRef, useEffect, useState } from 'react'
import { User, Bot, Loader2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Source, ExtendedMessage } from '@/lib/chatbot/types'
import { SourceCard } from '@/components/chatbot/source-card'
import { CitedMessage } from '@/components/chatbot/cited-message'
import { SourcesDialog } from '@/components/chatbot/sources-dialog'

// Define the status type
type ChatStatus = 'idle' | 'streaming' | 'submitted' | 'waiting' | 'error' | 'ready'

// Define props interface
interface ChatMessagesProps {
  messages: ExtendedMessage[]
  status: ChatStatus
  welcomeMessage?: string
  examples?: string[]
  onExampleClick: (example: string) => void
}

export function ChatMessages({ 
  messages, 
  status, 
  welcomeMessage = "Send a message to begin chatting with the AI assistant.", 
  examples = [], 
  onExampleClick
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  
  // State for the sources dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  
  // Get active message sources
  const activeMessage = messages.find(msg => msg.id === activeMessageId);
  const activeSources = activeMessage?.sources || [];
  
  // Function to open the sources dialog
  const handleViewAllSources = (messageId: string) => {
    setActiveMessageId(messageId);
    setDialogOpen(true);
  };
  
  // Function to close the sources dialog
  const handleCloseSourcesDialog = () => {
    setDialogOpen(false);
    setActiveMessageId(null);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length <= 1 && status !== 'streaming') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <Bot className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start a conversation
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {welcomeMessage}
          </p>
          {examples.length > 0 && (
            <div className="mt-4 space-y-2">
              {examples.map((example, index) => (
                <Card key={index} onClick={() => onExampleClick(example)} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-slate-700 dark:text-slate-300">{example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-6 scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, i) => (
            message.role !== "system" && (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={cn(
                  "flex items-start gap-3 group",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "rounded-full p-2 flex-shrink-0",
                  message.role === "user" 
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 order-2" 
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                )}>
                  {message.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                
                {/* Message bubble */}
                <div className="flex flex-col space-y-2 max-w-[80%]">
                  <div className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    message.role === "user" 
                      ? "bg-blue-500 text-white dark:bg-blue-600" 
                      : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  )}>
                    {message.role === "assistant" ? (
                      <CitedMessage content={message.content} sources={message.sources || []} />
                    ) : (
                      message.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line || "\u00A0"}
                        </p>
                      ))
                    )}
                  </div>
                  
                  {/* Show sources for AI messages when they exist */}
                  {message.role === "assistant" && 
                   message.sources && 
                   message.sources.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          Top Sources:
                        </p>
                        {message.sources.length > 2 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 px-2"
                            onClick={() => handleViewAllSources(message.id)}
                          >
                            <ExternalLink size={12} />
                            View all {message.sources.length} sources
                          </Button>
                        )}
                      </div>
                      {message.sources.slice(0, 2).map((source) => (
                        <SourceCard key={source.id} source={source} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          ))}
          
          {/* Loading indicator */}
          {status === "waiting" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="rounded-full p-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500 dark:text-slate-400 text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
          
          {/* Invisible div for automatic scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Sources Dialog */}
      <SourcesDialog 
        isOpen={dialogOpen}
        onClose={handleCloseSourcesDialog}
        sources={activeSources}
        messageId={activeMessageId || ''}
      />
    </>
  )
}