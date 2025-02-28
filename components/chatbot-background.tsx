'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ChatbotBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only render after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  const isDark = resolvedTheme === 'dark'
  
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dotPattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="2" 
                cy="2" 
                r="1" 
                fill={isDark ? '#8B9CB6' : '#475569'} 
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>
      
      {/* Optional: Subtle glow in corners */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    </div>
  )
}