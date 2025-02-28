'use client'

import { FormEvent, useRef, useEffect } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInput({ input, handleInputChange, handleSubmit, status, placeholder = "Type your message..." }) {
  const inputRef = useRef(null)
  const isReady = status !== 'streaming' && status !== 'submitted'
  
  // Focus input on mount and when status changes to ready
  useEffect(() => {
    if (isReady && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isReady])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && isReady) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={!isReady}
          className={cn(
            "w-full py-3 pl-4 pr-14 rounded-full border border-slate-200",
            "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200",
            isReady 
              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
              : "bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed"
          )}
        />
        
        {/* Clear input button - only shows when there's text */}
        {input && (
          <button
            type="button"
            onClick={() => handleInputChange({ target: { value: '' } } as any)}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
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
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-slate-200 text-slate-400 dark:bg-slate-700 cursor-not-allowed"
          )}
        >
          {status === 'streaming' || status === 'submitted' ? (
            <Sparkles size={18} className="animate-pulse" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      
      {/* Status indicator */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        {status === 'streaming' && (
          <span className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
            AI is responding...
          </span>
        )}
        {status === 'error' && (
          <span className="text-xs text-red-500">
            Error occurred. Please try again.
          </span>
        )}
      </div>
    </form>
  )
}