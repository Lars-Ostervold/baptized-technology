import { MessageCircle, BookIcon as Bible, Cloud, Heart } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    name: "Conversational Discipleship",
    description: "Engage with AI-powered chatbots trained in biblical wisdom—whether you're exploring C.S. Lewis' insights, studying Psalms, or deepening your theological understanding.",
    icon: MessageCircle,
  },
  {
    name: "Scripture Study & Exploration",
    description: "Go beyond reading—interact with Scripture like never before. Get AI-powered summaries, cross-references, and guided reflections on biblical passages.",
    icon: Bible,
  },
  {
    name: "AI-Guided Learning",
    description: "From book summaries to interactive Q&A on Christian classics, our AI tools make deep theological learning more accessible than ever.",
    icon: Cloud,
  },
  {
    name: "Faith-Driven Innovation",
    description: "The future of technology should serve the Kingdom. We're building AI-driven tools to empower believers, churches, and ministries for digital discipleship",
    icon: Heart,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <motion.div 
        className="mx-auto max-w-[58rem] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="relative font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          <span className="relative">
            Transformative Tools for Digital Discipleship
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl opacity-50" />
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how Baptized Technology is rethinking AI for faith. Our tools aren&apos;t just digital—they&apos;re discipleship-driven, designed to help believers and seekers engage Scripture, explore theology, and grow in their walk with Christ.        
        </p>
      </motion.div>
      <motion.div 
        className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature) => (
          <motion.div 
            key={feature.name} 
            className="group relative overflow-hidden rounded-lg border bg-background/50 p-8 transition-all hover:shadow-lg hover:border-primary/20"
            variants={item}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-0 transition-opacity group-hover:opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="relative rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                </div>
                <h3 className="font-bold">{feature.name}</h3>
              </div>
              <p className="mt-4 text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

