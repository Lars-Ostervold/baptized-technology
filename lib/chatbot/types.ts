// lib/chatbot/types.ts
import type { LucideIcon } from "lucide-react"
import type { Message } from "@ai-sdk/react"

export type Source = {
  id: string
  title: string
  content: string
  url?: string
  similarity?: number
}

export type ChatSession = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export type ChatbotConfig = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  category: string
  gradient: string
  iconColor: string
  systemPrompt: string
  welcomeMessage: string
  placeholderText: string
  vectorNamespace: string
  examples?: string[]
}