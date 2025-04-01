import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Heart, Sparkles, MessageCircle, ChevronDown } from "lucide-react"
import WaterBackground from "@/components/water-background"

export default function VisionPage() {
  return (
    <div className="relative">

      {/* Water background with animated waves */}
      <WaterBackground/>
      
      {/* Hero Section with animated entry */}
      <div className="container max-w-7xl py-24 relative z-10">
        <section className="space-y-8 text-center mb-24 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight pb-4 lg:text-7xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Revival is Coming. <br/> Information is the Catalyst.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The more we understand the beauty of Jesus, the more we are compelled to live out His Kingdom. Our tools put the best Christian minds at your fingertips—because revival starts with knowing the Truth.
          </p>
          <div className="flex justify-center pt-6">
            <div className="animate-bounce rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-xl">
              <ChevronDown className="h-6 w-6 text-primary" />
            </div>
          </div>
        </section>

        {/* Main content with enhanced visuals */}
        <section className="space-y-24 mb-24">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-6 relative">
              <div className="absolute -left-6 -top-6 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
              <h2 className="text-4xl font-bold relative">
                <span className="relative">
                  Wisdom at Your Fingertips
                  <div className="absolute -bottom-3 left-0 h-2 w-full bg-primary/20 -z-10 transform -rotate-1"></div>
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                There&apos;s a vast ocean of Christian wisdom—Scripture, theology, philosophy, and stories shaped by a baptized imagination.
                But how do we access it when we need it?
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Imagine instantly finding insights from trusted voices—C.S. Lewis, Augustine, modern theologians—all in one place.
                Our tools don&apos;t replace study; they enhance it, connecting you with centuries of Spirit-led wisdom.
              </p>
            </div>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -right-10 top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute left-5 bottom-5 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              
              {/* Content wrapper with glass effect */}
              <div className="relative backdrop-blur-sm p-8 border-l-4 border-primary/30 pl-10">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="rounded-full bg-gradient-to-br from-primary/20 to-primary/40 p-2 shadow-lg mr-3 flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </span>
                  A Guide, Not a Guru
                </h3>
                <p className="text-muted-foreground text-lg">
                  AI can&apos;t replace community or the Holy Spirit&apos;s work, but it can serve as a faithful assistant.
                  Think of it as a digital study companion, pointing you to the best resources when you need them most.
                </p>
                
                {/* Subtle decorative line */}
                <div className="mt-6 h-0.5 w-1/3 bg-gradient-to-r from-primary/30 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:gap-12 md:grid-cols-3">
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-primary" />,
                title: "Wisdom, Not Just Information",
                description: "Our tools relay the wisdom of trusted, biblical sources— sages who have wrestled with Scripture before us. Our tools will never generate knowledge from secular sources, but only from our carefully curated database."
              },
              {
                icon: <Heart className="h-10 w-10 text-primary" />,
                title: "Tools, Not Replacements",
                description: "AI should lead people to Jesus, not distract from Him. If it doesn't serve that mission, we won't build it."
              },
              {
                icon: <Sparkles className="h-10 w-10 text-primary" />,
                title: "Doorways, Not Destinations",
                description: "We don't just give answers—we guide people deeper. Real faith isn't about shortcuts; it's about seeking, questioning, and growing."
              }
            ].map((item, i) => (
              <Card key={i} className="bg-gradient-to-br from-background/90 to-background/70 border-primary/10 backdrop-blur-sm overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="pt-8 pb-8 px-6 relative">
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="rounded-full bg-primary/10 p-3 w-fit mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/0 rounded-3xl"></div>
          <div className="bg-background/40 backdrop-blur-sm p-12 rounded-3xl border border-primary/10 shadow-xl relative z-10">
            <div className="space-y-8 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-center">
                <span className="relative inline-block">
                  What We&apos;re Building
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5C67 1.5 131 1.5 199 5.5" stroke="hsl(var(--primary) / 0.4)" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
              <p className="text-xl text-center text-muted-foreground font-medium">
                Imagine never losing a key insight again. Instantly find what BibleProject, Lewis, or early church fathers said about a passage.
                No more &quot;I know they talked about this somewhere...&quot;
              </p>
              <ul className="space-y-4 text-lg">
                {[
                  "AI-powered assistants that connect you with trusted biblical wisdom",
                  "Domain-specific tools designed for deep study, not generic responses",
                  "Resources that enhance—not replace—your personal discipleship",
                  "A commitment to open-source development and theological integrity",
                  "Serving up wisdom, not manufacturing it—waiters, not chefs"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary/20 transition-colors duration-300">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center space-y-10">
          <h2 className="text-4xl font-bold">
            <span className="relative">
              Join Our Mission
              <div className="absolute -bottom-3 left-0 h-2 w-full bg-primary/20 -z-10 transform -rotate-1"></div>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us create technology that brings people closer to Jesus and spreads Shalom in the world.
            Faithful, open-source, and free.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Button asChild size="lg" className="font-semibold text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <Link href="/chatbots">
                Explore Our Tools 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 transition-all duration-300">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}