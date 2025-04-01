"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Toast, ToastProps } from "./toast"

interface ToastContextType {
  showToast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const showToast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
  }, [])

  const removeToast = React.useCallback((index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-[350px]"
            >
              <Toast
                {...toast}
                onClose={() => removeToast(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 