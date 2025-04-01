"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastProps = {
  title?: string
  description: string
  variant?: "default" | "success" | "destructive" | "info"
  duration?: number
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, variant = "default", duration = 5000, onClose }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true) //eslint-disable-line @typescript-eslint/no-unused-vars

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }, [duration, onClose])

    const variants = {
      initial: { opacity: 0, y: 50, scale: 0.3 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
    }

    const iconVariants = {
      initial: { scale: 0 },
      animate: { scale: 1 },
      exit: { scale: 0 }
    }

    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "bg-emerald-950/90 dark:bg-emerald-950/90 border-emerald-800/50 dark:border-emerald-800/50 text-emerald-50 dark:text-emerald-50 backdrop-blur-sm"
        case "destructive":
          return "bg-red-950/90 dark:bg-red-950/90 border-red-800/50 dark:border-red-800/50 text-red-50 dark:text-red-50 backdrop-blur-sm"
        case "info":
          return "bg-blue-950/90 dark:bg-blue-950/90 border-blue-800/50 dark:border-blue-800/50 text-blue-50 dark:text-blue-50 backdrop-blur-sm"
        default:
          return "bg-slate-950/90 dark:bg-slate-950/90 border-slate-800/50 dark:border-slate-800/50 text-slate-50 dark:text-slate-50 backdrop-blur-sm"
      }
    }

    const getIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        case "destructive":
          return <AlertCircle className="h-5 w-5 text-red-400" />
        case "info":
          return <Info className="h-5 w-5 text-blue-400" />
        default:
          return <Mail className="h-5 w-5 text-slate-400" />
      }
    }

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          "relative flex w-full items-center space-x-4 rounded-lg border p-4 shadow-lg shadow-black/20",
          getVariantStyles()
        )}
      >
        <motion.div
          variants={iconVariants}
          className="flex-shrink-0"
        >
          {getIcon()}
        </motion.div>
        <div className="flex-1 space-y-1">
          {title && (
            <p className="text-sm font-medium leading-none tracking-tight">
              {title}
            </p>
          )}
          <p className="text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="absolute right-2 top-2 rounded-md p-1 text-slate-400 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast } 