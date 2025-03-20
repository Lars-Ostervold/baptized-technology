import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { SITE_IMAGE, SITE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE } from "@/lib/constants"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  robots: "follow, index",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [SITE_IMAGE],
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: "Baptized Technology - AI Refined in the Fire of Baptism",
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
  },
  icons: {
    icon: [
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
      { rel: "shortcut icon", url: "/favicon/favicon.ico" },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Analytics />
        <AuthProvider>
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
        </AuthProvider>
      </body>
    </html>
  )
}