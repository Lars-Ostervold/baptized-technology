"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/auth/login-dialog"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { LogOut, Lock, Unlock, UserCheck, UserX, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionDetails, setSessionDetails] = useState<Record<string, any> | null>(null)
  
  // Function to refresh auth state
  const refreshAuthState = async () => {
    setLoading(true)
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      if (session) {
        // Get session details without sensitive info
        const sessionInfo = {
          expires_at: new Date(session.expires_at * 1000).toLocaleString(),
          last_refreshed: new Date().toLocaleString(),
          provider: session.user.app_metadata.provider || 'unknown',
          user_id: session.user.id,
        }
        setSessionDetails(sessionInfo)
      } else {
        setSessionDetails(null)
      }
    } catch (error) {
      console.error("Error refreshing auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    refreshAuthState()
  }

  // Set up auth state listener
  useEffect(() => {
    refreshAuthState()
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
        refreshAuthState()
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Test Page</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        {!user ? (
          <LoginDialog 
            trigger={
              <Button size="lg">
                <Lock className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            } 
            onLoginSuccess={refreshAuthState}
          />
        ) : (
          <Button variant="destructive" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
        
        <Button variant="outline" size="lg" onClick={refreshAuthState}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh State
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Authentication Status
              {loading ? (
                <Skeleton className="h-5 w-5 ml-2 rounded-full" />
              ) : user ? (
                <Unlock className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <Lock className="ml-2 h-5 w-5 text-orange-500" />
              )}
            </CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="flex items-center">
                <Badge variant={user ? "default" : "outline"} className={user ? "bg-green-500" : ""}>
                  {user ? "Authenticated" : "Not Authenticated"}
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  {user ? (
                    <span className="flex items-center">
                      <UserCheck className="mr-1 h-4 w-4 text-green-500" />
                      User is signed in
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserX className="mr-1 h-4 w-4 text-orange-500" />
                      No active session
                    </span>
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Details about the current user</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : user ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email Verified:</strong> {user.email_confirmed_at ? "Yes" : "No"}</p>
                <p><strong>Auth Provider:</strong> {user.app_metadata?.provider || "Unknown"}</p>
                {user.user_metadata && (
                  <div>
                    <p className="font-medium mt-2">User Metadata:</p>
                    <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(user.user_metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Not signed in</p>
            )}
          </CardContent>
        </Card>
        
        {/* Session Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Information about your current session</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : sessionDetails ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(sessionDetails).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-medium capitalize">{key.replace(/_/g, ' ')}:</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No active session</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Session data is updated when auth state changes or when manually refreshed
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}