import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import NavbarWrapper from "@/components/navbar-wrapper"
import { SITE_IMAGE, SITE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE } from "@/lib/constants"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Analytics } from "@vercel/analytics/react"
import { ToastProvider } from "@/components/ui/toast-provider"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'm5RB8MFXNFTTLWsEqRTG-id0HCjUsKoWRBmoXyvZw-8',
  },
  alternates: {
    canonical: SITE_URL,
  },
  themeColor: "#000000",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [SITE_IMAGE],
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Baptized Technology - AI Refined in the Fire of Baptism",
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
  },
  icons: {
    icon: [
      { rel: "icon", url: "/favicon/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
    ],
    apple: [
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon/safari-pinned-tab.svg", color: "#000000" },
    ],
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/favicon/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-C9RB2SV391`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C9RB2SV391');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Analytics />
        <AuthProvider>
          <ToastProvider>
            <div className="relative z-10">
              <NavbarWrapper />
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}