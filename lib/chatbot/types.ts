// lib/chatbot/types.ts
import type { LucideIcon } from "lucide-react"
import type { Message } from "@ai-sdk/react"

export type Source = {
  id: string
  type: string
  title: string
  content: string
  url?: string
  similarity?: number
  metadata?: {
    type?: 'book' | 'podcast' | 'article' | 'video' | 'speech' | 'research_paper' | 'blog' | 'website' | 'bible'
    
    // Book metadata
    author?: string
    publisher?: string
    publication_year?: number
    isbn?: string
    page?: number
    
    // Podcast metadata
    episode_number?: number
    episode_title?: string
    timestamp?: number
    duration?: number
    
    // Article metadata
    publication_date?: string
    
    // Video metadata
    platform?: string
    video_length?: number
    
    // Speech metadata
    speaker?: string
    speech_date?: string
    
    // Research paper metadata
    journal_name?: string
    doi?: string
    
    // Bible metadata
    book?: string
    chapter?: string | number
    verse?: string | number
    translation?: string
    
    // Allow for additional custom metadata fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  chatbot_id: string;
    messages: {
      id: string;
      role: 'system' | 'user' | 'assistant';
      content: string;
    }[];
  created_at: string;
  updated_at: string;
}

export type { Message }

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
  comingSoon?: boolean
}

export interface ExtendedMessage extends Message {
  sources?: Source[];
}