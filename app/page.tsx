import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Image
        src="/images/compact_logo_BT.png"
        alt="Baptized Technology"
        width={80}
        height={80}
        className="mb-8 rounded-xl"
      />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Baptized Technology
      </h1>

      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        This project has been retired and is no longer maintained.
      </p>

      <p className="mt-6 max-w-md text-muted-foreground">
        I&apos;m now working on what we&apos;re doing at Austin Christian University.
      </p>

      <a
        href="https://austinchristianuniversity.org"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Visit Austin Christian University
        <span aria-hidden="true">&rarr;</span>
      </a>
    </main>
  )
}
