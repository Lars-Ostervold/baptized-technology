import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"

const glowVariants: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
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
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
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
            className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          <div className="relative">
            <motion.h1 
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              variants={textVariants}
            >
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent blur-3xl opacity-70" />
                <span className="relative bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Technology Immersed in the Fire of Baptism
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl opacity-50" />
              </span>
            </motion.h1>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
            />
          </div>
        </motion.div>
        <motion.p 
          className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Revival is coming. Information is the catalyst. <br/>
          We build AI tools to put the best Christian minds in your pocket. Because when people experience the beauty of Jesus' story, they are compelled to live it out.
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
    </section>
  )
}

