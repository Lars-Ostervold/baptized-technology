import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Script from "next/script"
import { SITE_URL, SITE_NAME } from "@/lib/constants"

interface ChatbotCardProps {
  title: string
  description: string
  icon: LucideIcon
  category: string
  href: string
  gradient: string
  iconColor: string
  comingSoon?: boolean
}

export function ChatbotCard({
  title,
  description,
  icon: Icon,
  category,
  href,
  gradient,
  iconColor,
  comingSoon,
}: ChatbotCardProps) {
  // Generate structured data for this specific chatbot
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${title} AI - Christian Chatbot by ${SITE_NAME}`,
    "applicationCategory": "ChatBot",
    "operatingSystem": "Web",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": `${SITE_URL}${href}`,
    "applicationSubCategory": "Christian AI",
    "category": category,
  };
  
  const content = (
    <>
      {!comingSoon && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <Card
        className={`
        relative overflow-hidden transition-all duration-300
        ${comingSoon ? "opacity-70" : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"}
        bg-background/80 backdrop-blur-sm
      `}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30`} />
        <CardHeader className="relative space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${iconColor} bg-background/80 backdrop-blur-sm`}>
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">
                  <span itemProp="name">{title}</span>
                  {!comingSoon && (
                    <span className="sr-only"> AI - Christian Chatbot by {SITE_NAME}</span>
                  )}
                </CardTitle>
                {comingSoon && (
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground" itemProp="applicationCategory">{category}</p>
            </div>
          </div>
          <CardDescription className="text-base" itemProp="description">{description}</CardDescription>
        </CardHeader>
      </Card>
    </>
  )

  if (comingSoon) {
    return content
  }

  return (
    <Link href={href} itemScope itemType="https://schema.org/SoftwareApplication">
      {content}
    </Link>
  )
}

