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
  title: `Bible AI | Scripture AI Assistant | ${SITE_NAME}`,
  description: 'Experience the Bible as a unified story that leads to Jesus with our AI-powered Biblical assistant.',
  robots: {
    index: true,
    follow: true,
  }
}

export default function BibleAI() {
  // Redirect to the BibleProject chatbot
  redirect('/chatbots/bibleproject')
} 