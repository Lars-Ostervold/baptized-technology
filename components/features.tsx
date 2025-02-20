import { BookIcon as Bible, Cloud, Shield, Heart } from "lucide-react"

const features = [
  {
    name: "Conversational Discipleship",
    description: "Engage with AI-powered chatbots trained in biblical wisdom—whether you&apos;re exploring C.S. Lewis&apos; insights, studying Psalms, or deepening your theological understanding.",
    icon: Bible,
  },
  {
    name: "Scripture Study & Exploration",
    description: "Go beyond reading—interact with Scripture like never before. Get AI-powered summaries, cross-references, and guided reflections on biblical passages.",
    icon: Cloud,
  },
  {
    name: "AI-Guided Learning",
    description: "From book summaries to interactive Q&A on Christian classics, our AI tools make deep theological learning more accessible than ever.",
    icon: Heart,
  },
  {
    name: "Faith-Driven Innovation",
    description: "The future of technology should serve the Kingdom. We&apos;re building AI-driven tools to empower believers, churches, and ministries for digital discipleship",
    icon: Shield,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Transformative Tools for Digital Discipleship
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Baptized Technology is rethinking AI for faith. Our tools aren&apos;t just digital—they&apos;re discipleship-driven, designed to help believers and seekers engage Scripture, explore theology, and grow in their walk with Christ.        
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

