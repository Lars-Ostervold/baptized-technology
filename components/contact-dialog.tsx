"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function ContactDialog({ children }: { children?: React.ReactNode }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.")
      }
      
      // Reset form on success
      setName("")
      setEmail("")
      setMessage("")
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          <DialogDescription>
            Have questions about Baptized Technology? Send a message and I'll get back to you.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3 w-fit mx-auto">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. I'll respond as soon as possible.
            </p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => setIsSuccess(false)}
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can I help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}