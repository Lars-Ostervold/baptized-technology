import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Ready to baptize your technology in purpose?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Join forward-thinking churches and faith-based organizations who trust Baptized Technology to drive their
          digital transformation and deepen their impact in the digital age.
        </p>
        <Button size="lg">
          Start Your Journey Today
        </Button>
      </div>
    </section>
  )
}

