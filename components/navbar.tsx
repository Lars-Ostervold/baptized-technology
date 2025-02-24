import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="hidden sm:block">
            <span className="font-bold">Baptized Technology</span>
          </div>
          <div className="sm:hidden">
              <Image src="/images/compact_logo_BT.png" alt="Baptized Technology" width={32} height={32} />
          </div>
        </Link>
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          <Link href="/vision" className="transition-colors hover:text-primary animate-shimmer">
            Vision
          </Link>
          <Link href="/about" className="transition-colors hover:text-primary animate-shimmer">
            About
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="https://github.com/baptizedtech" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Button variant="ghost" size="default" className="hidden animate-shimmer sm:inline-flex">
            Contact
          </Button>
          <Button size="default" className="hidden animate-shimmer sm:inline-flex">
            Try the AI
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 pt-8">
                <Link href="/vision" className="text-lg font-medium transition-colors hover:text-primary">
                  Vision
                </Link>
                <Link href="/about" className="text-lg font-medium transition-colors hover:text-primary">
                  About
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Link
                    href="https://github.com/baptizedtech"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                  <Button variant="ghost" size="default" className="justify-start">
                    Contact
                  </Button>
                  <Button size="default" className="justify-start">
                    Try the Buddies
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

