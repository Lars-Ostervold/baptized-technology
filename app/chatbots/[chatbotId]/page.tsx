import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getChatbotConfig } from "@/lib/chatbot/config"
import ChatInterface from "@/components/chatbot/chat-interface"
import ChatbotBackground from "@/components/chatbot-background"
import ChatbotHeader from "@/components/chatbot/chatbot-header"

interface ChatbotPageProps {
  params: {
    chatbotId: string
  }
}

export const generateMetadata = async ({ params }: ChatbotPageProps): Promise<Metadata> => {
  try {
    const config = getChatbotConfig(params.chatbotId)
    return {
      title: `${config.title} | Baptized Technology`,
      description: config.description,
    }
  } catch {
    return {
      title: 'Chatbot | Baptized Technology',
      description: 'AI Tools for Christian Life',
    }
  }
}

export default function ChatbotPage({ params }: ChatbotPageProps) {
  try {
    const config = getChatbotConfig(params.chatbotId)
    
    // Get the icon name as a string from the icon component
    // This assumes config.icon is imported like: import { Brain } from "lucide-react"
    // So we extract the name from the displayName or the function name
    const iconName = config.icon.displayName || config.icon.name || "HelpCircle"
    
    return (
      <>
        <ChatbotBackground />
        <div className="h-screen flex flex-col">
          {/* Pass the icon name rather than the component */}
          <ChatbotHeader 
            title={config.title}
            iconName={iconName}
            iconColor={config.iconColor}
          />
          
          <div className="flex-1 overflow-hidden relative">
            <ChatInterface chatbotId={params.chatbotId} />
          </div>
        </div>
      </>
    )
  } catch {
    return notFound()
  }
}