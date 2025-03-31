import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const content = (
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
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{title}</CardTitle>
              {comingSoon && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  Coming Soon
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  )

  if (comingSoon) {
    return content
  }

  return <Link href={href}>{content}</Link>
}

