import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Heart, Sparkles, MessageCircle } from "lucide-react"
import WaterBackground from "@/components/water-background"

export default function VisionPage() {
  return (
    <div className="container max-w-7xl py-20 relative z-10">
      <WaterBackground />
      
      <section className="space-y-6 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Our Vision for Baptized Technology
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Reimagining how technology can deepen our encounter with Jesus and the biblical story
        </p>
      </section>

      <section className="space-y-16 mb-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Study on Steroids</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              BibleProject opened my eyes to the true beauty of the biblical story. Reading Scripture on its terms.
              Encountering Jesus in his context. Yet in personal study, most of us lack the skillset to 
              experience that same beauty.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Even when resources exist, they're scattered and inaccessible in our moment of need.
              What if there was a place where you could have the giants of faith help you experience
              the beauty of the Bible without spending hours combing through old podcasts or searching for books?
            </p>
          </div>
          <div className="rounded-lg overflow-hidden bg-muted/50 p-6 border border-border">
            <div className="space-y-6">
              <MessageCircle className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Experience the Bible like never before</h3>
              <p className="text-muted-foreground">
                Study as if you have 2,000 years of Spirit-driven wisdom sitting in the room with you.
                Not replacing human connection, but enhancing your personal study.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:gap-16 md:grid-cols-3">
          <Card className="bg-background/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <BookOpen className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Wisdom, Not Just Information</h3>
              <p className="text-muted-foreground">
                Our tools don't generate knowledge from general sources. They relay the wisdom of trusted, biblical sources—the sages who've wrestled with Scripture before us.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <Heart className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Tools, Not Replacements</h3>
              <p className="text-muted-foreground">
                These are tools that should drive people to Jesus. If they're not serving that mission, we don't want them. People need love, not AI—we pray these tools help you know Love more deeply.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <Sparkles className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Doorways, Not Destinations</h3>
              <p className="text-muted-foreground">
                There's value in searching for answers. We don't want to take away this experience, which is why we recommend sources. We want you to dive deeper.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 p-8 rounded-lg border border-border mb-20">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center">What We're Building</h2>
          <p className="text-lg text-center text-muted-foreground">
            Imagine finding exactly what BibleProject said about a passage, instantly.
            No more "I know they talked about this somewhere..."
          </p>
          <ul className="space-y-4 text-lg">
            {[
              "Domain-specific tools for knowledge-based areas of study",
              "Assistants that connect you with trusted biblical sources",
              "Ways to enhance—not replace—your personal Bible study",
              "Open source tools that anyone can contribute to and improve",
              "Building waiters, not chefs—serving up wisdom rather than creating it"
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <ArrowRight className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="text-center space-y-8">
        <h2 className="text-3xl font-bold">Join Our Mission</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Help us create technology that brings people closer to Jesus and spreads Shalom in the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/chatbots">Explore Our Tools</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-semibold">
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}