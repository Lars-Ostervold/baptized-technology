import { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Christian AI Chatbots | Bible-Based AI Assistants | " + SITE_NAME,
  description: "Explore our collection of faith-based AI chatbots designed to help you engage with Biblical content, spiritual formation, and Christian thinking.",
  keywords: "Christian AI, Bible chatbot, faith-based AI, Christian chatbots, BibleProject AI, Bible study tools, AI for spiritual growth, Biblical assistant, Christian technology, John Mark Comer AI, Tim Keller AI, faith and technology",
  openGraph: {
    title: "Christian AI Chatbots | Bible-Based AI Assistants",
    description: "Explore our collection of faith-based AI chatbots designed to help you engage with Biblical content, spiritual formation, and Christian thinking.",
    url: SITE_URL + "/chatbots",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian AI Chatbots | Bible-Based AI Assistants",
    description: "Explore our collection of faith-based AI chatbots designed to help you engage with Biblical content, spiritual formation, and Christian thinking.",
  },
  alternates: {
    canonical: SITE_URL + "/chatbots",
  }
} 