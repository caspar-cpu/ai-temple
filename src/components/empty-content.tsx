import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SunMark } from "@/components/sun-mark";

/**
 * Centered empty-state Card with a soft SunMark, a Cormorant display
 * heading, optional body copy, and a single primary CTA button. Used
 * across /plugins, /skills, /articles, /courses, /teams/[slug] when
 * lists return zero rows.
 */
export function EmptyContent({
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 py-10 text-center">
      <SunMark className="size-10 text-primary/70" />
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {body && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {body}
          </p>
        )}
      </div>
      <Button href={ctaHref} className="mt-2">
        {ctaLabel}
      </Button>
    </Card>
  );
}
