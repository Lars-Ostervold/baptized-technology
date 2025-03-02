"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ChatbotCard } from "@/components/chatbot-card"
import { 
  Brain, Scroll, Library, BookMarked, 
  PenTool, Calendar, MessageCircle, HelpCircle, 
  Church, Heart
} from "lucide-react"
import { LoginDialog } from "@/components/auth/login-dialog"
import { useAuth } from "@/components/auth/auth-provider"
import WaterBackground from "@/components/water-background"

const chatbots = [
  {
    title: "BibleProject",
    description:
      "An AI companion for Bible study and theological exploration. Provides insights, summaries, and explanations of biblical themes and concepts.",
    icon: Scroll,
    category: "Podcasts",
    href: "/chatbots/bibleproject",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "John Mark Comer",
    description: "Chatbot inspired by John Mark Comer, providing insights on spiritual formation and cultural commentary.",
    icon: Heart,
    category: "Spiritual Formation",
    href: "/chatbots/johnMarkComer",
    gradient: "from-green-500/10 to-teal-500/10",
    iconColor: "text-green-500",
  },
  {
    title: "Dallas Willard",
    description: "Chatbot inspired by Dallas Willard, offering wisdom on spiritual disciplines and Christian philosophy.",
    icon: Brain,
    category: "Christian Philosophy",
    href: "/chatbots/dallasWillard",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    title: "CS Lewis",
    description: "Chatbot inspired by CS Lewis, discussing theology, literature, and apologetics.",
    icon: BookMarked,
    category: "Theology & Literature",
    href: "/chatbots/csLewis",
    gradient: "from-red-500/10 to-pink-500/10",
    iconColor: "text-red-500",
  },
  {
    title: "Tim Keller",
    description: "Chatbot inspired by Tim Keller, providing insights on urban ministry, apologetics, and cultural engagement.",
    icon: Church,
    category: "Urban Ministry",
    href: "/chatbots/timKeller",
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "AI Book Summaries",
    description: "Chatbot that lets you have a conversation about books, ask for key passages, and more.",
    icon: Library,
    category: "Book Summaries",
    href: "/chatbots/aiBookSummaries",
    gradient: "from-teal-500/10 to-blue-500/10",
    iconColor: "text-teal-500",
  },
  {
    title: "PsalmBot",
    description: "Chatbot that breaks down the poetry of Psalms, explaining conventions and symbols.",
    icon: PenTool,
    category: "Biblical Poetry",
    href: "/chatbots/psalmBot",
    gradient: "from-orange-500/10 to-yellow-500/10",
    iconColor: "text-orange-500",
  },
  {
    title: "Study Plan Bot",
    description: "Chatbot that creates study plans based on a topic or book and a timeframe, including deeper resources.",
    icon: Calendar,
    category: "Study Plans",
    href: "/chatbots/studyPlanBot",
    gradient: "from-pink-500/10 to-red-500/10",
    iconColor: "text-pink-500",
  },
  {
    title: "WWJDIHWM",
    description: "Chatbot that contextualizes Jesus' teachings in your life, using a reasoning model.",
    icon: MessageCircle,
    category: "Contextual Theology",
    href: "/chatbots/wwjdiHwm",
    gradient: "from-indigo-500/10 to-purple-500/10",
    iconColor: "text-indigo-500",
  },
  {
    title: "GotQuestions Bot",
    description: "Chatbot using information from gotquestions.org to answer burning questions about the Bible and philosophy.",
    icon: HelpCircle,
    category: "Biblical Answers",
    href: "/chatbots/gotQuestionsBot",
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-500",
  },
]

export default function SolutionsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChatbots = chatbots.filter(
    (chatbot) =>
      chatbot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container max-w-7xl py-20">
      <WaterBackground/>
      <div className="space-y-2 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">AI Solutions</h1>
        <p className="text-muted-foreground text-lg">
          Discover our specialized AI chatbots designed to revolutionize different industries
        </p>
      </div>

      {!user && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">Want to save your chat history and preferences?</p>
          <LoginDialog />
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search chatbots..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid of Chatbots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChatbots.map((chatbot) => (
          <ChatbotCard key={chatbot.title} {...chatbot} />
        ))}
      </div>
    </div>
  )
}