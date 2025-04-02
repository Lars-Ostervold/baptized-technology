'use client'

import { motion } from 'framer-motion'
import { Loader2, Search, Brain, Sparkles, CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type RagStatus = 'idle' | 'planning' | 'searching' | 'summarizing' | 'search_failed'

interface RagStatusIndicatorProps {
  status: RagStatus
  className?: string
}

const statusConfig = {
  idle: {
    icon: Sparkles,
    text: 'Ready to chat!',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    animation: {
      icon: { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  planning: {
    icon: Brain,
    text: 'Planning response...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    animation: {
      icon: { 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  searching: {
    icon: Search,
    text: 'Searching knowledge base...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    animation: {
      icon: { 
        x: [0, 5, 0],
        scale: [1, 1.1, 1]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  summarizing: {
    icon: Loader2,
    text: 'Preparing response...',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    animation: {
      icon: { rotate: 360 },
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
    }
  },
  search_failed: {
    icon: CircleAlert,
    text: 'The database search function experienced an error.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    animation: {
      icon: { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
}

export function RagStatusIndicator({ status, className }: RagStatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full',
        'border backdrop-blur-sm shadow-sm',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <motion.div
        animate={config.animation.icon}
        transition={config.animation.transition}
        className="relative"
      >
        <Icon className={cn('h-4 w-4', config.color)} />
        {status !== 'idle' && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full',
              config.bgColor,
              'opacity-50'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
      <motion.span 
        className={cn('text-sm font-medium', config.color)}
        animate={{
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {config.text}
      </motion.span>
    </motion.div>
  )
} 