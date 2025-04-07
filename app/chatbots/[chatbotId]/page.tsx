import { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { getChatbotConfig } from "@/lib/chatbot/config"
import ChatInterface from "@/components/chatbot/chat-interface"
import ChatbotBackground from "@/components/chatbot-background"
import ChatbotHeader from "@/components/chatbot/chatbot-header"
import { SITE_URL, SITE_NAME } from "@/lib/constants"

interface ChatbotPageProps {
  params: {
    chatbotId: string
  }
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const generateMetadata = async ({ params }: ChatbotPageProps): Promise<Metadata> => {
  try {
    const config = getChatbotConfig(params.chatbotId)
    
    // Use more descriptive and SEO-optimized titles and descriptions
    const title = `${config.title} AI | Christian Chatbot | ${SITE_NAME}`
    const description = `Experience ${config.title} AI - ${config.description} A faith-based artificial intelligence chatbot powered by ${SITE_NAME}.`
    
    // Create keywords based on the chatbot type and category
    const keywords = [
      `${config.title} AI`,
      `Christian ${config.title} chatbot`,
      `Bible AI`,
      `Christian AI`,
      `${config.category}`,
      `AI ${config.category}`,
      `${config.title} assistant`,
      `${config.title} helper`,
      `Christian technology`,
      `Faith-based AI`,
      `${config.title} faith AI`,
      `${config.category} assistant`,
      `Religious AI`,
      `Christian chatbot`,
      `Biblical assistant`,
      `Baptized Technology`,
    ].join(',')
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/chatbots/${params.chatbotId}`,
        siteName: SITE_NAME,
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `${SITE_URL}/chatbots/${params.chatbotId}`,
      }
    }
  } catch {
    return {
      title: 'Christian AI Chatbot | Baptized Technology',
      description: 'Explore our faith-based AI tools designed to help you grow spiritually with Biblical wisdom and guidance.',
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