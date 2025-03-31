import Link from "next/link"
import { Button } from "@/components/ui/button"
import {  
  BookOpen, 
  GitFork,  
  Heart,
  SendHorizonal,
  ChevronRight,
  Check
} from "lucide-react"
import WaterBackground from "@/components/water-background"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ContactDialog } from "@/components/contact-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="relative">
      <WaterBackground />
      
      {/* Hero Section with improved styling */}
      <div className="container max-w-7xl py-24 relative z-10">
        <section className="space-y-8 text-center mb-24">
          <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 rounded-full">Our Story</Badge>
          <h1 className="text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            About Baptized Technology
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Creating tools that help you encounter Jesus more deeply through Scripture.
          </p>
        </section>

        <section className="mb-32">
          <div className="max-w-3xl mx-auto space-y-6 relative">
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
            <h2 className="text-4xl font-bold relative">
              <span className="relative">
                Who We Are
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 150 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C50 1.5 100 1.5 149 5.5" stroke="hsl(var(--primary) / 0.4)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hi 👋, I&apos;m Lars—the developer behind Baptized Technology. This project grew out of my own
              journey with Scripture and the transformative impact of biblical resources like BibleProject.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              But Baptized Technology isn&apos;t about me. It&apos;s about Jesus. It&apos;s about crafting tools that
              guide people deeper into relationship with Him and equip them to live out His mission in the world.
            </p>
          </div>
        </section>

        {/* What We Do section with tabs */}
        <section className="mb-32">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl font-bold">
              <span className="relative">
                What We Do
                <div className="absolute -bottom-3 left-0 h-2 w-full bg-primary/20 -z-10 transform -rotate-1"></div>
              </span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We develop technology that serves as a bridge to biblical wisdom, not a replacement for it.
            </p>
          </div>
          
          <Tabs defaultValue="tools" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
              <TabsTrigger value="tools">Our Tools</TabsTrigger>
              <TabsTrigger value="development">Our Process</TabsTrigger>
            </TabsList>
            <TabsContent value="tools" className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-lg">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Knowledge Tools for Biblical Study</h3>
                    <p className="text-muted-foreground">
                      Our tools focus on specific areas of biblical study, functioning as digital assistants that
                      connect you with trusted resources for deeper scriptural engagement.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {[
                    "Access insights from biblical scholars",
                    "Find connections across Scripture",
                    "Study Bible in its historical context",
                    "Discover ancient wisdom for today"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-primary/5 p-4 rounded-lg">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="development" className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-lg">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <GitFork className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Open-Source Development</h3>
                    <p className="text-muted-foreground">
                      Every tool we create is open-source on GitHub. We believe in transparency and collaboration—
                      these resources belong to the body of Christ, not any single person or organization.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {[
                    "Transparent development process",
                    "Community contributions welcome",
                    "Open source codebase",
                    "Shared knowledge resources"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-primary/5 p-4 rounded-lg">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ section with improved accordion */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold inline-block relative">
              Frequently Asked Questions
              <div className="absolute -bottom-3 left-0 h-2 w-full bg-primary/20 -z-10 transform -rotate-1"></div>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Are these AI tools replacing human teachers?",
                  answer: "Not at all. These tools are designed to guide you to Jesus and the wisdom of biblical teachers, not replace them. Spiritual growth happens in relationship and community—our tools simply help you access biblical insights more effectively."
                },
                {
                  question: "Where does the information come from?",
                  answer: "Our tools relay information only from trusted biblical sources. They don't generate new theology or pull from the general internet. Every source is carefully selected to ensure reliability and faithfulness to Scripture."
                },
                {
                  question: "How can I support this project?",
                  answer: "You can support us through prayer, financial contributions, or by contributing to our open-source projects on GitHub. As a solo-run initiative, every form of support helps extend these tools to more people."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i+1}`} className="border-primary/10 last:border-0">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Support section with enhanced design */}
        <section className="text-center mb-32">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl -z-10"></div>
            <div className="bg-background/40 backdrop-blur-sm p-10 rounded-3xl border border-primary/20 shadow-xl">
              <div className="space-y-8">
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-4xl font-bold">Support Our Mission</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Baptized Technology is a labor of love created to serve the Church. Your support helps us
                  develop more tools and keep them freely accessible.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                  <Button asChild size="lg" className="font-semibold text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                    <Link href="/support">
                      <SendHorizonal className="mr-2 h-5 w-5" /> Support Financially
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-semibold text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 transition-all duration-300">
                    <a href="https://github.com/baptizedtechnology" target="_blank" rel="noopener noreferrer">
                      <GitFork className="mr-2 h-5 w-5" /> Contribute on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact section with enhanced design */}
        <section className="text-center space-y-10">
          <h2 className="text-4xl font-bold">
            <span className="relative">
              Connect With Us
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5C67 1.5 131 1.5 199 5.5" stroke="hsl(var(--primary) / 0.4)" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or suggestions? I&apos;d love to hear from you.
          </p>
          <ContactDialog>
            <Button size="lg" className="font-semibold px-8 py-6 text-lg mt-4 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity shadow-lg">
              Get in Touch <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </ContactDialog>
        </section>
      </div>
    </div>
  )
}