import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { metadata as homeMetadata } from "./metadata"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  ...homeMetadata,
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
    ],
    apple: [
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
