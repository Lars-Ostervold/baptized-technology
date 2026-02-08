import { Metadata } from "next"
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_IMAGE } from "@/lib/constants"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME + " — Retired",
  description: SITE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME + " — Retired",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [SITE_IMAGE],
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME + " — Retired",
    description: SITE_DESCRIPTION,
  },
}
