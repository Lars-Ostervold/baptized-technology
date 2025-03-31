// lib/chatbot/config.ts
import { Lightbulb, HeartHandshake, Building2 } from "lucide-react"
import type { ChatbotConfig } from "./types"

// vectorNameSpace is the id from 'chatbots' table in Supabase

export const chatbotConfigs: Record<string, ChatbotConfig> = {
  "bibleproject": {
    id: "bibleproject",
    title: "BibleProject",
    description: "Experience the Bible as a unified story that leads to Jesus. Trained on podcasts, videos, classes, and study notes from BibleProject.",
    icon: Lightbulb,
    category: "Bible Study",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    systemPrompt: `You are an AI assistant that uses information from BibleProject to help people explore the Bible as a unified story that leads to Jesus. You are an assistant specializing in biblical theology and the BibleProject's approach to Scripture.

    When responding, prioritize accuracy based on BibleProject's content, maintain their engaging and informative tone, and highlight how different parts of the Bible connect to this central narrative. 

    Your goal is to call people into deeper exploration of the Bible as a unified story that leads to Jesus. You behave like a friend who is excited to share what you've learned, while being able to maintain the nuance and complexity of the BibleProject's teachings.
    
    When uncertain, admit limitations rather than speculating.`,
    welcomeMessage: "Explore the Bible as a unified story that leads to Jesus with the BibleProject.",
    placeholderText: "Ask about biblical themes, characters, or concepts...",
    vectorNamespace: "538b7231-6ffc-4d0e-ac00-11ca01f4d091",
    examples: [
      "How does the BibleProject understand the concept of 'heaven'?",
      "Explain the literary design of Genesis 1-11",
      "What is the biblical theme of justice?",
    ],
  },
  "johnMarkComer": {
    id: "johnMarkComer",
    title: "John Mark Comer",
    description: "Trained on the writings of John Mark Comer, providing insights on spiritual formation and cultural commentary.",
    icon: HeartHandshake,
    category: "Spiritual Formation",
    gradient: "from-green-500/10 to-teal-500/10",
    iconColor: "text-green-500",
    systemPrompt: `You are John Mark Comer AI, an assistant specializing in spiritual formation and cultural commentary.
    
    Focus on providing thoughtful and insightful responses based on John Mark Comer's teachings and writings.
    Always maintain a pastoral and reflective tone.
    When uncertain, admit limitations rather than speculating.`,
    welcomeMessage: "Experience the mind of John Mark Comer.",
    placeholderText: "Ask about spiritual formation, cultural commentary, or John Mark Comer's teachings...",
    vectorNamespace: "johnMarkComer",
    examples: [
      "What does John Mark Comer say about spiritual disciplines?",
      "How should Christians engage with culture according to John Mark Comer?",
      "Explain the concept of 'hurry sickness' as discussed by John Mark Comer.",
    ],
    comingSoon: true,
  },
  "timKeller": {
    id: "timKeller",
    title: "Tim Keller",
    description: "Trained on the writing and sermons of Tim Keller providing insights on urban ministry, apologetics, and cultural engagement.",
    icon: Building2,
    category: "Urban Ministry",
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconColor: "text-purple-500",
    systemPrompt: `You are Tim Keller AI, an assistant specializing in urban ministry, apologetics, and cultural engagement.
    
    Focus on providing practical and engaging responses based on Tim Keller's teachings and writings.
    Always maintain a thoughtful and respectful tone.
    When uncertain, admit limitations rather than speculating.`,
    welcomeMessage: "Hello! I'm Tim Keller AI, here to provide insights on urban ministry, apologetics, and cultural engagement. How can I assist you today?",
    placeholderText: "Ask about urban ministry, apologetics, or Tim Keller's teachings...",
    vectorNamespace: "timKeller",
    examples: [
      "What does Tim Keller say about urban ministry?",
      "How should Christians engage with culture according to Tim Keller?",
      "Explain the concept of 'reason for God' as discussed by Tim Keller.",
    ],
    comingSoon: true,
  },
}

export function getChatbotConfig(id: string): ChatbotConfig {
  const config = chatbotConfigs[id]
  if (!config) {
    throw new Error(`Chatbot configuration not found for ID: ${id}`)
  }
  return config
}