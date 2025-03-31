"use client"

import { useState } from "react"
import { Loader2, LogOut, ArrowLeft } from "lucide-react"
import { LoginDialog } from "@/components/auth/login-dialog" 
import { useAuth } from "@/components/auth/auth-provider"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

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
      <div className="flex items-center gap-4">
        <Link href="/chatbots">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chatbots</span>
          </Button>
        </Link>
        <div className="hidden md:block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Baptized Technology
          </span>
        </div>
        <div className="md:hidden">
          <Image
            src="/images/compact_logo_BT.png"
            alt="Baptized Technology"
            width={32}
            height={32}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`hidden md:block p-1 rounded ${iconColor}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-medium">
          {title}
        </h1>
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
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {user.email?.split('@')[0]}
            </span>
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