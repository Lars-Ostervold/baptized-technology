import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import WaterBackground from "@/components/water-background"
import Navbar from "@/components/navbar"
import { SITE_IMAGE, SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [SITE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
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
        <WaterBackground />
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}