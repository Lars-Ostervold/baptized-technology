import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br pb-2 from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Technology Immersed in the Fire of Baptism
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Technology is advancing at an unprecedented pace. But innovation without purpose is empty. 
          At Baptized Technology, we refine AI and digital tools to serve the Kingdom—guiding hearts 
          into deeper faith and discipleship.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/vision">
          <Button size="lg">
            Explore the Vision
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

