import { redirect } from 'next/navigation'
import { Metadata, Viewport } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const viewport: Viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: `Christian AI Chatbots | Faith-Based AI Assistants | ${SITE_NAME}`,
  description: 'Explore our collection of Christian AI chatbots for spiritual growth, Biblical study, and faith-based assistance.',
  robots: {
    index: true,
    follow: true,
  }
}

export default function ChristianAI() {
  // Redirect to the chatbots page
  redirect('/chatbots')
} 