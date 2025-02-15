import { BookIcon as Bible, Cloud, Shield, Heart } from "lucide-react"

const features = [
  {
    name: "Faith-Driven AI",
    description: "Harness the power of AI to deepen understanding of scripture and foster spiritual growth.",
    icon: Bible,
  },
  {
    name: "Secure Cloud Solutions",
    description: "Scalable, resilient, and secure cloud infrastructure for churches and faith-based organizations.",
    icon: Cloud,
  },
  {
    name: "Digital Discipleship",
    description: "Innovative tools to support and enhance digital ministry and online community building.",
    icon: Heart,
  },
  {
    name: "Data Protection",
    description: "State-of-the-art security measures to protect sensitive information and preserve privacy.",
    icon: Shield,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Transformative Solutions
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Baptized Technology can empower your ministry with our innovative, faith-driven technologies.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

