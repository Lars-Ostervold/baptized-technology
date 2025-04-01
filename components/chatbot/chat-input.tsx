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
  const [hasInteracted, setHasInteracted] = useState(false)
  const [truncatedPlaceholder, setTruncatedPlaceholder] = useState(placeholder)
  const [isMobile, setIsMobile] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isReady = status !== 'streaming' && status !== 'submitted' && !isSubmitting
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Handle long placeholder text
  useEffect(() => {
    if (isMobile) {
      // Calculate a reasonable max length for mobile (approximately 2 lines)
      const maxLength = 80 // Approximate character count for 2 lines on mobile
      
      if (placeholder.length > maxLength) {
        setTruncatedPlaceholder(placeholder.substring(0, maxLength) + '...')
      } else {
        setTruncatedPlaceholder(placeholder)
      }
    } else {
      setTruncatedPlaceholder(placeholder)
    }
  }, [placeholder, isMobile])
  
  // Expose form reference to parent components
  useEffect(() => {
    // Make the form reference available to window for programmatic submission
    if (formRef.current) {
      (window as any).__chatFormElement = formRef.current //eslint-disable-line @typescript-eslint/no-explicit-any
    }
    
    return () => {
      // Clean up reference when component unmounts
      delete (window as any).__chatFormElement //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }, [formRef])

  // Reset submitting state when parent status changes to ready
  useEffect(() => {
    if (status === 'ready') {
      setIsSubmitting(false)
      
      // Ensure the textarea is clear when ready
      if (input === '') {
        clearInput()
      }
    }
  }, [status, input]) //eslint-disable-line react-hooks/exhaustive-deps
  
  // Focus input on mount and when status changes to ready
  useEffect(() => {
    if (isReady && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isReady])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Store original placeholder
      const originalPlaceholder = textarea.placeholder;
      
      // Temporarily remove placeholder to get accurate height for input
      textarea.placeholder = '';
      textarea.style.height = 'auto';
      
      // Get height for current input
      const inputHeight = textarea.scrollHeight;
      
      // Restore placeholder and measure again
      textarea.placeholder = originalPlaceholder;
      const heightWithPlaceholder = textarea.scrollHeight;
      
      // Use the larger of the two heights, but cap at max height
      const finalHeight = Math.min(
        Math.max(inputHeight, heightWithPlaceholder),
        isMobile ? 120 : 76 // Allow more height on mobile
      );
      
      textarea.style.height = `${finalHeight}px`;
    }
  }, [input, truncatedPlaceholder, isMobile])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && isReady) {
      // Set submitting state immediately
      setIsSubmitting(true)
      setHasInteracted(true)
      
      // First submit the form
      handleSubmit(e)
      
      // Then clear the input (after a very short delay to ensure the submission picked up the input)
      setTimeout(() => {
        clearInput()
      }, 10)
    }
  }

  // Handle keydown events for Enter and Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && isReady) {
        // Set submitting state immediately
        setIsSubmitting(true)
        setHasInteracted(true)
        
        // First submit the form
        handleSubmit(e as unknown as FormEvent)
        
        // Then clear the input (after a very short delay to ensure the submission picked up the input)
        setTimeout(() => {
          clearInput()
        }, 10)
      }
    }
  }

  // Function to clear input with proper typing
  const clearInput = () => {
    const event = { 
      target: { value: '' } 
    } as ChangeEvent<HTMLTextAreaElement>
    handleInputChange(event)
    
    // Also directly clear the textarea value as a backup
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative">
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
            : hasInteracted 
              ? "Ask more..." 
              : truncatedPlaceholder}
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
            maxHeight: isMobile ? '120px' : '76px',
            lineHeight: '1.5rem',
            paddingTop: isMobile ? '12px' : '10px',
            paddingBottom: isMobile ? '12px' : '10px',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            overflowY: 'auto'
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