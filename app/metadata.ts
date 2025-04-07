import { Metadata } from "next"
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_IMAGE } from "@/lib/constants"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Christian AI Chatbots for Biblical Study | Bible-Based AI | " + SITE_NAME,
  description: SITE_DESCRIPTION + " Explore our Bible AI chatbots and Christian AI tools designed to deepen your faith journey.",
  keywords: "Christian AI, Bible AI, faith-based technology, Christian chatbots, BibleProject AI, AI for spiritual growth, Biblical assistant, Christian technology, John Mark Comer AI, Tim Keller AI, baptized technology, AI Bible study, Christian digital tools",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Christian AI Chatbots for Biblical Study | " + SITE_NAME,
    description: "Discover AI tools refined in the fire of baptism. Experience the Bible as a unified story and engage with Christian thinkers through AI chatbots.",
    url: SITE_URL,
    images: [SITE_IMAGE],
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian AI Chatbots | Bible-Based AI",
    description: "Discover AI tools refined in the fire of baptism. Experience the Bible as a unified story and engage with Christian thinkers through AI chatbots.",
    images: [SITE_IMAGE],
  },
} 