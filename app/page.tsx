'use client'
import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import WaterBackground from "@/components/water-background"
import Script from 'next/script'
import { SITE_NAME, SITE_URL } from "@/lib/constants"

export default function Home() {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/chatbots?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "description": "Christian AI chatbots for Bible study, spiritual formation, and exploring faith concepts through the lens of Biblical theology.",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/compact_logo_BT.png`,
    "sameAs": [
      "https://twitter.com/BaptizedTech",
      "https://www.instagram.com/baptizedtechnology/"
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="organization-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="relative min-h-screen">
        <WaterBackground />
        <div className="relative z-10">
          <Hero />
          <Features />
          <CTA />
          <Footer />
        </div>
      </div>
    </>
  )
}

