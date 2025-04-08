import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { ScrollIndicator } from "@/components/scroll-indicator"

const glowVariants: Variants = {
  initial: { opacity: 0.3, scale: 1 },
  animate: {
    opacity: [0.3, 0.5, 0.3],
    scale: [1, 1.05, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

export default function Hero() {
  return (
    <section className="container relative min-h-screen max-w-screen-2xl flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="relative mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          <div className="relative">
            <h1 
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              variants={textVariants}
            >
              <span className="relative inline-block">
                <span className="relative text-foreground">
                  Technology Immersed in the Fire of Baptism
                </span>
              </span>
            </h1>
          </div>
        </motion.div>
        <motion.p 
          className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Revival is coming. Information is the catalyst. <br/>
          We build AI tools to put the best Christian minds in your pocket. Because when people experience the beauty of Jesus&apos; story, they are compelled to live it out.
        </motion.p>
      </motion.div>
      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
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
      <motion.div
        className="absolute bottom-[calc(3.5rem+2rem)] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  )
}

