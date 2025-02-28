// app/chatbots/[chatbotId]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getChatbotConfig, chatbotConfigs } from "@/lib/chatbot/config"
import ChatInterface from "@/components/chatbot/chat-interface"
import { LoginDialog } from "@/components/auth/login-dialog"
import ChatbotBackground from "@/components/chatbot-background"

export const dynamic = "force-dynamic"

interface ChatbotPageProps {
  params: {
    chatbotId: string
  }
}

export async function generateStaticParams() {
  return Object.keys(chatbotConfigs).map((chatbotId) => ({
    chatbotId,
  }))
}

export async function generateMetadata({ params }: ChatbotPageProps): Promise<Metadata> {
  try {
    const config = getChatbotConfig(params.chatbotId)
    return {
      title: `${config.title} - Baptized Technology`,
      description: config.description,
    }
  } catch (error) {
    return {
      title: "Chatbot - Baptized Technology",
      description: "AI chatbot by Baptized Technology",
    }
  }
}

export default function ChatbotPage({ params }: ChatbotPageProps) {
  try {
    const config = getChatbotConfig(params.chatbotId)
    
    return (
      <>
        <ChatbotBackground />
        <div className="h-[calc(100vh-3.5rem)] flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${config.iconColor}`}>
                <config.icon className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-medium">{config.title}</h1>
            </div>
            <LoginDialog />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatInterface chatbotId={params.chatbotId} />
          </div>
        </div>
      </>
    )
  } catch (error) {
    return notFound()
  }
}