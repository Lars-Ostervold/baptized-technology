'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChatbotWelcomeAnimation } from './chatbot-welcome-animation'

interface EnhancedWelcomeProps {
  welcomeMessage: string
  examples: string[]
  onExampleClick: (example: string) => void
}

export function EnhancedWelcome({ welcomeMessage, examples, onExampleClick }: EnhancedWelcomeProps) {
  const [mounted, setMounted] = useState(false)
  
  // Mount animation after component is rendered
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Animation variants for staggered animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  }
  
  const exampleVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: 0.5 + (i * 0.1),
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    })
  }

  // Text animation variants
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  const glowVariants: Variants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background animation */}
      {mounted && <ChatbotWelcomeAnimation />}
      
      {/* Glowing overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/80 z-10" />
      
      {/* Content container */}
      <motion.div 
        className="relative z-20 text-center max-w-md mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated title with glow effect */}
        <motion.div 
          className="relative mx-auto mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          <div className="relative">
            <motion.h1 
              className="text-4xl font-bold text-foreground mb-2"
              variants={textVariants}
            >
              {welcomeMessage}
            </motion.h1>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
            >
            </motion.div>
          </div>
        </motion.div>
        
        {/* Example cards with hover effects */}
        {examples.length > 0 && (
          <motion.div 
            className="space-y-3 mt-6"
            variants={itemVariants}
          >
            <motion.p 
              className="text-sm font-medium text-muted-foreground mb-2"
              variants={itemVariants}
            >
              Try asking about:
            </motion.p>
            
            <div className="space-y-2">
              {examples.map((example, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={exampleVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    onClick={() => onExampleClick(example)} 
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 bg-card/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <p className="text-foreground">{example}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 