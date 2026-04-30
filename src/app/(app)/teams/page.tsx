import Link from "next/link";
import { Card, SectionLabel } from "@/components/ui/card";
import { cardHoverLift, linkFocusRing } from "@/lib/style";
import { cn } from "@/lib/utils";
import { TEAMS } from "@/lib/teams";

export default function TeamsIndexPage() {
  return (
    <div className="space-y-8">
      <header>
        <SectionLabel>Team specific</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          AI tailored to your function
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Three articles per team, sequenced from beginner to advanced. Start
          with yours.
        </p>
      </header>

      <h2 className="sr-only">All teams</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAMS.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.slug}>
              <Link
                href={`/teams/${t.slug}`}
                className={cn("block h-full", linkFocusRing)}
              >
                <Card className={cn("h-full", cardHoverLift)}>
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
