import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="relative font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            <span className="relative">
              Ready to baptize your technology in purpose?
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl opacity-50" />
            </span>
          </h2>
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Step into the future of faith-driven technology. Explore AI-powered discipleship tools trusted by believers seeking to grow deeper in their walk with Jesus.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/chatbots">
            <Button 
              size="lg"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 px-8 py-6 text-lg font-medium transition-all hover:scale-105 hover:shadow-lg"
            >
              <span className="relative z-10 flex items-center">
                Explore the AI
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-50" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

