import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import {
  HowItWorksSection,
  PointsTableSection,
  TrophyGallerySection,
  ContributeSection,
} from "@/components/about-sections";
import { SunMark } from "@/components/sun-mark";

export default function HowItWorksPage() {
  return (
    <div className="space-y-20">
      <header className="text-center">
        <SectionLabel>How it works</SectionLabel>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          The shortest tour of the Temple.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A quick reference for what lives here, how points work, and every
          nugget &amp; gemstone you can mine.
        </p>
      </header>

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
            Ready to climb the board?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Add a plugin, drop an article in, or tick off a course you've
            already done.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/plugins/submit">Add a plugin</Button>
            <Button href="/articles/submit" variant="secondary">
              Add an article
            </Button>
            <Button href="/courses/submit" variant="secondary">
              Add a course
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
