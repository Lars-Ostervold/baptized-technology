import { metadata } from "./metadata"
import type { Viewport } from "next"

export { metadata }

export const viewport: Viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function ChatbotsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 