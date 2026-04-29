import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import {
  HowItWorksSection,
  PointsTableSection,
  TrophyGallerySection,
  ContributeSection,
} from "@/components/about-sections";
import { SunHorizon } from "@/components/sun-horizon";
import { SunMark } from "@/components/sun-mark";
import { getOptionalUser } from "@/lib/dal";

export default async function AboutPage() {
  const user = await getOptionalUser();
  const enterHref = user ? "/" : "/login";
  const enterLabel = user ? "Enter the Temple" : "Sign in";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur md:px-8">
        <Link href="/about" className="flex items-center gap-3">
          <SunMark className="size-8 text-primary" />
          <span className="font-display text-base tracking-wide">
            The AI Temple
          </span>
        </Link>
        <Button href={enterHref} size="sm">
          {enterLabel}
        </Button>
      </header>

      <main className="mx-auto max-w-5xl space-y-20 px-6 py-16 md:px-8 md:py-24">
        <section className="text-center">
          <SunHorizon className="mx-auto mb-6 h-24 w-full max-w-md" />
          <SectionLabel>For everyone at Temple of the Sun</SectionLabel>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            One library. Every AI plugin, course, and article, in one place.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Find a plugin, apply it in your AI tool, learn something, mine
            nuggets and gemstones. Everything we build for AI lives here, kept
            current by pulling directly from GitHub.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={enterHref}>{enterLabel}</Button>
            <Button href="#how-it-works" variant="secondary">
              How it works
            </Button>
          </div>
        </section>

        <HowItWorksSection />
        <PointsTableSection />
        <TrophyGallerySection />
        <ContributeSection />

        <section>
          <Card className="bg-primary/5 text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
              <SunMark className="size-6 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Ready to start mining?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
              {user
                ? "Pick up where you left off."
                : "Sign in with any email. No passwords. We send you a magic link."}
            </p>
            <div className="mt-6 flex justify-center">
              <Button href={enterHref}>{enterLabel}</Button>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground md:px-8">
        The AI Temple · For Temple of the Sun · Inspired by Ramp&apos;s Dojo
      </footer>
    </div>
  );
}
