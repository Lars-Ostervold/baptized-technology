'use client'

import { FormEvent, useRef, useEffect, ChangeEvent, useState } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define status type
type ChatStatus = 'idle' | 'streaming' | 'submitted' | 'waiting' | 'error' | 'ready'
// Define props interface
interface ChatInputProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent) => void
  status: ChatStatus
  placeholder?: string
}

export function ChatInput({ 
  input, 
  handleInputChange, 
  handleSubmit, 
  status, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  // Local state for immediate visual feedback
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isReady = status !== 'streaming' && status !== 'submitted' && !isSubmitting
  
  // Reset submitting state when parent status changes to ready
  useEffect(() => {
    if (status === 'ready') {
      setIsSubmitting(false)
    }
  }, [status])
  
  // Focus input on mount and when status changes to ready
  useEffect(() => {
    if (isReady && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isReady])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && isReady) {
      // Set submitting state immediately
      setIsSubmitting(true)
      // Clear input immediately on submit
      clearInput()
      handleSubmit(e)
    }
  }

  // Handle keydown events for Enter and Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && isReady) {
        // Set submitting state immediately
        setIsSubmitting(true)
        // Clear input immediately on submit
        clearInput()
        handleSubmit(e as unknown as FormEvent)
      }
    }
  }

  // Function to clear input with proper typing
  const clearInput = () => {
    const event = { 
      target: { value: '' } 
    } as ChangeEvent<HTMLTextAreaElement>
    handleInputChange(event)
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className={cn(
        "relative rounded-lg transition-all duration-200",
        (status === 'streaming' || status === 'submitted' || isSubmitting)
          ? "bg-slate-50 dark:bg-slate-900/50" 
          : "bg-white dark:bg-slate-800"
      )}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={(status === 'streaming' || status === 'submitted' || isSubmitting) 
            ? "Working on your request..." 
            : placeholder}
          disabled={!isReady}
          rows={1}
          className={cn(
            "w-full py-2.5 pl-4 pr-24 rounded-lg border-none",
            "bg-transparent dark:text-slate-100",
            "focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "outline-none ring-0 ring-offset-0 box-border",
            "transition-all duration-200 resize-none overflow-hidden",
            "leading-6 flex items-center shadow-sm border border-slate-200 dark:border-slate-700",
            isReady 
              ? "text-slate-900 dark:text-white" 
              : "text-slate-400 cursor-not-allowed"
          )}
          style={{ 
            minHeight: '44px',
            lineHeight: '1.5rem',
            paddingTop: '10px'
          }}
        />
        
        {/* Clear input button - only shows when there's text and input is ready */}
        {input && isReady && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={!isReady || !input.trim()}
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2",
            "transition-all duration-200 ease-in-out",
            isReady && input.trim()
              ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              : "bg-slate-200 text-slate-400 dark:bg-slate-700 cursor-not-allowed"
          )}
        >
          {(status === 'streaming' || status === 'submitted' || isSubmitting) ? (
            <Sparkles size={18} className="animate-pulse" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      
      {/* Status indicator */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        {status === 'error' && (
          <span className="text-xs text-red-500">
            Error occurred. Please try again.
          </span>
        )}
      </div>
    </form>
  )
}