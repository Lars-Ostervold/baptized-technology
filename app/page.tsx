import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}

