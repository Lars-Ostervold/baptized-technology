"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ChatbotCard } from "@/components/chatbot-card"
import { Bot, Brain, Code, BookOpen, Stethoscope, Scale, Calculator, Briefcase, Wrench, Microscope } from "lucide-react"

const chatbots = [
  {
    title: "BibleProject",
    description:
      "An AI companion for Bible study and theological exploration. Provides insights, summaries, and explanations of biblical themes and concepts.",
    icon: Code,
    category: "Podcasts",
    href: "/bibleproject",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "EduBot",
    description:
      "An intelligent tutor for students and educators. Covers various subjects and adapts to different learning styles.",
    icon: BookOpen,
    category: "Education",
    href: "/solutions/edubot",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    title: "HealthCare Assistant",
    description:
      "Medical information and guidance at your fingertips. Helps understand symptoms and medical terminology.",
    icon: Stethoscope,
    category: "Healthcare",
    href: "/solutions/healthcare",
    gradient: "from-red-500/10 to-pink-500/10",
    iconColor: "text-red-500",
  },
  {
    title: "LegalBot",
    description: "Simplifies legal concepts and provides basic legal information. Perfect for initial legal research.",
    icon: Scale,
    category: "Legal",
    href: "/solutions/legal",
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "FinanceGPT",
    description: "Your financial advisor AI. Helps with budgeting, investment basics, and financial planning.",
    icon: Calculator,
    category: "Finance",
    href: "/solutions/finance",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    title: "BusinessPro AI",
    description: "Strategic business insights and market analysis. Helps with business planning and decision making.",
    icon: Briefcase,
    category: "Business",
    href: "/solutions/business",
    gradient: "from-teal-500/10 to-cyan-500/10",
    iconColor: "text-teal-500",
  },
  // Coming Soon Chatbots
  {
    title: "EngineeringBot",
    description:
      "Advanced engineering calculations, simulations, and technical documentation assistance. Coming to revolutionize engineering workflows.",
    icon: Wrench,
    category: "Engineering",
    href: "/solutions/engineering",
    gradient: "from-zinc-500/10 to-stone-500/10",
    iconColor: "text-zinc-500",
    comingSoon: true,
  },
  {
    title: "ScienceBot",
    description:
      "Your AI lab assistant for scientific research, data analysis, and experiment planning. The future of scientific discovery.",
    icon: Microscope,
    category: "Science",
    href: "/solutions/science",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-500",
    comingSoon: true,
  },
  {
    title: "ResearchBot",
    description: "Accelerate your research with AI-powered literature review and data analysis assistance.",
    icon: Brain,
    category: "Research",
    href: "/solutions/research",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    title: "CustomBot",
    description: "Build your own specialized AI chatbot tailored to your specific industry or use case.",
    icon: Bot,
    category: "Custom",
    href: "/solutions/custom",
    gradient: "from-slate-500/10 to-gray-500/10",
    iconColor: "text-slate-500",
  },
]

export default function SolutionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChatbots = chatbots.filter(
    (chatbot) =>
      chatbot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container max-w-7xl py-20">
      <div className="space-y-2 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">AI Solutions</h1>
        <p className="text-muted-foreground text-lg">
          Discover our specialized AI chatbots designed to revolutionize different industries
        </p>
      </div>

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

