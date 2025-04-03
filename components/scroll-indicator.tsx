"use client"

import { ChevronDown } from "lucide-react"

interface ScrollIndicatorProps {
  text?: string
}

export function ScrollIndicator({ text }: ScrollIndicatorProps) {
  return (
    <button 
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      className="flex flex-col items-center gap-2 group"
    >
      {text && (
        <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          {text}
        </p>
      )}
      <div className="animate-bounce">
        <ChevronDown className="h-6 w-6 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      </div>
    </button>
  )
} 