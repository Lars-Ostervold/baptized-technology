import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {  
  BookOpen, 
  User, 
  GitFork,  
  Heart,
  SendHorizonal
} from "lucide-react"
import WaterBackground from "@/components/water-background"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {ContactDialog} from "@/components/contact-dialog"

export default function AboutPage() {
  return (
    <div className="container max-w-7xl py-20 relative z-10">
      <WaterBackground />
      
      <section className="space-y-6 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          About Baptized Technology
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Creating tools that help you encounter Jesus more deeply through Scripture
        </p>
      </section>

      <section className="grid gap-12 lg:grid-cols-2 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hi, I&apos;m Lars—the sole developer behind Baptized Technology. This project emerged from my own 
            journey with Scripture and my experiences with BibleProject and other transformative biblical resources.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At its core, Baptized Technology isn&apos;t about me. It&apos;s about Jesus. It&apos;s about creating tools 
            that lead people deeper into relationship with Him and drive them to action in bringing Shalom to the world.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden bg-muted/50 p-6 border border-border">
          <div className="space-y-6">
            <User className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">A One-Person Mission</h3>
            <p className="text-muted-foreground">
              While I&apos;m the only one running this project, it exists to serve a much larger purpose—connecting 
              people with the wisdom of Scripture and two millennia of Spirit-led biblical scholarship.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-bold">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We develop technology that serves as a bridge to biblical wisdom, not a replacement for it.
          </p>
        </div>
        
        <div className="grid gap-8 lg:gap-16 md:grid-cols-2 mb-12">
          <Card className="bg-background/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <BookOpen className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Knowledge Tools for Specific Domains</h3>
              <p className="text-muted-foreground">
                Our tools focus on narrow, knowledge-based domains in biblical studies. 
                Think of them as digital assistants that connect you with trusted resources 
                for specific topics, books, or areas of study.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-border">
            <CardContent className="pt-6 space-y-4">
              <GitFork className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Open-Source Development</h3>
              <p className="text-muted-foreground">
                All our tools are open-sourced on GitHub. We believe in transparency and 
                community contribution—these resources belong to the body of Christ, 
                not to any single person or organization.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Are these AI bots replacing human teachers?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Absolutely not. These tools are designed to point to Jesus and the wisdom of human 
                  teachers, not replace them. We believe deeply in the value of human relationship 
                  and community for spiritual growth. Our tools simply help you access insights 
                  from trusted sources more efficiently.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Where does the information come from?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Our tools only relay information from trusted, biblical sources that we&apos;ve 
                  specifically selected and trained them on. They don&apos;t generate their own theology 
                  or draw from general internet knowledge. We&apos;re committed to sourcing wisdom from 
                  reliable teachers and always pointing you back to those original resources.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How can I support this project?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  You can support us through prayer, financial contributions, or by contributing 
                  to our open-source projects on GitHub. As a one-person operation, every form of 
                  support makes a significant difference in helping these tools reach more people.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What&apos;s the relationship with BibleProject?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  We deeply appreciate BibleProject&apos;s work and have been personally transformed by 
                  their content. Some of our tools help you find and access BibleProject resources 
                  more efficiently, but Baptized Technology is an independent project not officially 
                  affiliated with BibleProject.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="text-center mb-20">
        <div className="max-w-3xl mx-auto bg-muted/30 p-8 rounded-lg border border-border">
          <div className="space-y-6">
            <Heart className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Support Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Baptized Technology is a labor of love created to serve the Church. 
              Your support helps us develop more tools and keep them freely accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/support">
                  <SendHorizonal className="mr-2 h-4 w-4" /> Support Financially
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <a href="https://github.com/baptizedtechnology" target="_blank" rel="noopener noreferrer">
                  <GitFork className="mr-2 h-4 w-4" /> Contribute on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center space-y-8">
        <h2 className="text-3xl font-bold">Connect With Us</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions or suggestions? I&apos;d love to hear from you.
        </p>
        <ContactDialog>
            <Button size="lg" className="font-semibold">Get in Touch</Button>
        </ContactDialog>
      </section>
    </div>
  )
}