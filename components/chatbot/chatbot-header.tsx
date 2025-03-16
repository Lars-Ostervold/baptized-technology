"use client"

import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { LoginDialog } from "@/components/auth/login-dialog" 
import { useAuth } from "@/components/auth/auth-provider"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatbotHeaderProps {
  title: string
  iconName: string
  iconColor: string
}

export default function ChatbotHeader({ title, iconName, iconColor }: ChatbotHeaderProps) {
  const { user, loading, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Dynamically get the icon component from the name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = iconName && typeof iconName === 'string' && iconName in LucideIcons 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? (LucideIcons as any)[iconName] as React.FC<any>
  : LucideIcons.HelpCircle
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded ${iconColor}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      ) : !user ? (
        <LoginDialog />
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-xs text-green-600 dark:text-green-400">
            Logged in as {user.email?.split('@')[0]}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      )}
    </div>
  )
}