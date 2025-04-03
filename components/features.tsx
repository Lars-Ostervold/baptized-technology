import { MessageCircle, BookIcon as Bible, Cloud, Heart } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    name: "Conversational Wisdom",
    description: "Engage with AI-powered chatbots trained on biblical wisdom. Whether you're exploring C.S. Lewis' philosophy or wondering why Melchizedek is mentioned in Hebrews - we've got you covered.",
    icon: MessageCircle,
  },
  {
    name: "Scripture Without Barriers",
    description: "Stop getting stuck. Instantly access cross-references, historical context, and theological insights to illuminate the beauty of God's Word.",
    icon: Bible,
  },
  {
    name: "Effortless Theology",
    description: "Whether you're studying a classic Christian work, unpacking complex doctrines, or diving into historical theology, our AI tools surface the most insightful resources for your journey—right when you need them.",
    icon: Cloud,
  },
  {
    name: "Technology for the Kingdom",
    description: "AI shouldn't replace relationships—it should remove friction in discipleship. We build tools that equip believers, churches, and ministries to engage deeper and grow stronger.",
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
            Dive into the beauty of Jesus
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl opacity-50" />
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discipleship flourishes when knowledge is accessible. Baptized Technology is building AI-powered tools that remove barriers between believers and the wisdom of Scripture, theologians, and Christian thought leaders. Our mission is simple: remove the barriers to experiencing the beauty of Jesus so we can be transformed by His love.       
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

