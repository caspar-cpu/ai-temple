import { BookOpen, Compass, GraduationCap, Lightbulb, Wrench } from "lucide-react";
import { Card, SectionLabel, BigNumber } from "@/components/ui/card";
import { TrophyIcon } from "@/components/trophy-icon";
import { cardHoverLift } from "@/lib/style";
import { cn } from "@/lib/utils";
import {
  POINTS,
  TROPHY_KINDS,
  TROPHY_META,
  type TrophyTier,
} from "@/lib/points";

const TIER_GROUPS: { tier: TrophyTier; label: string }[] = [
  { tier: "bronze", label: "Bronze nuggets" },
  { tier: "silver", label: "Silver nuggets" },
  { tier: "gold", label: "Gold nuggets" },
  { tier: "special", label: "Uncut gemstones" },
];

const POINTS_TABLE: { activity: string; points: number }[] = [
  { activity: "Tick an onboarding step", points: POINTS.journey_step },
  { activity: "Read an article", points: POINTS.article_read },
  { activity: "Apply an AI tool", points: POINTS.ai_tool_used },
  { activity: "Apply a skill", points: POINTS.skill_used },
  { activity: "Apply a plugin", points: POINTS.plugin_used },
  { activity: "Add an article", points: POINTS.article_contributed },
  { activity: "Add a course", points: POINTS.course_contributed },
  { activity: "Add a skill", points: POINTS.skill_contributed },
  { activity: "Contribute a plugin", points: POINTS.plugin_contributed },
  { activity: "Complete a course", points: POINTS.course_completed },
  {
    activity: "Finish the full onboarding journey",
    points: POINTS.journey_completed,
  },
  {
    activity: "Your plugin used by 10 people",
    points: POINTS.plugin_widely_used,
  },
];

/**
 * "How it works" marketing block on the /about page. Five gamified
 * content types, each as a card with its primary point reward. Add a
 * new content type → add a card here AND extend `POINTS`/`TROPHY_KINDS`
 * in `lib/points.ts`. Heading text references the card count, so
 * update both when adding a sixth.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <SectionLabel className="text-center">How it works</SectionLabel>
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
        Five sections, all gamified
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <HowCard
          icon={<Wrench className="size-5 text-primary" />}
          title="Plugins"
          body="Claude skills hosted on GitHub. Click into a plugin to see the install command, an example of how to invoke it, and the live SKILL.md. Tick 'I've used this' to log the win."
          points={POINTS.plugin_used}
          pointsLabel="per plugin applied"
        />
        <HowCard
          icon={<Lightbulb className="size-5 text-primary" />}
          title="Skills"
          body="Marketplace skills that bolt onto Claude. Each one ships a single capability — PDF, XLSX, slide-creator. Tick 'I've used this' when you put it to work."
          points={POINTS.skill_used}
          pointsLabel="per skill applied"
        />
        <HowCard
          icon={<Compass className="size-5 text-primary" />}
          title="AI Tools"
          body="The 2026 field guide of AI tools, ordered by leverage. From flagship models down to niche utilities. Log the ones you've actually used."
          points={POINTS.ai_tool_used}
          pointsLabel="per tool applied"
        />
        <HowCard
          icon={<GraduationCap className="size-5 text-primary" />}
          title="Courses"
          body="AI courses from Anthropic and others. Completing one earns the biggest single nugget on the board. The most efficient way to climb the leaderboard."
          points={POINTS.course_completed}
          pointsLabel="per course completed"
        />
        <HowCard
          icon={<BookOpen className="size-5 text-primary" />}
          title="Articles"
          body="Curated AI reading: Karpathy, Anthropic, and whatever's worth a read this week. Tick when you've read one and collect a bronze nugget."
          points={POINTS.article_read}
          pointsLabel="per article read"
        />
      </div>
    </section>
  );
}

/**
 * Reads `POINTS_TABLE` (declared at top of this file) into a divided
 * list inside a Card. Edit the table to add rows — values come from
 * `POINTS` so changing a reward in lib/points.ts is reflected here.
 */
export function PointsTableSection() {
  return (
    <section>
      <SectionLabel className="text-center">The score</SectionLabel>
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
        How points work
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        Every action earns points. Your total powers the leaderboard in the
        top-right corner of the app.
      </p>
      <Card className="mx-auto mt-8 max-w-2xl p-0">
        <ul className="divide-y divide-border">
          {POINTS_TABLE.map((r) => (
            <li
              key={r.activity}
              className="flex items-center justify-between px-6 py-4 text-sm"
            >
              <span>{r.activity}</span>
              <span className="font-semibold tabular-nums">+{r.points}</span>
            </li>
          ))}
        </ul>
      </Card>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
        Milestone badges also fire at 1 / 5 / 10 / 25 plugins used.
      </p>
    </section>
  );
}

/**
 * Catalog of every nugget/gem grouped by tier (bronze → silver →
 * gold → uncut gem). Pulls from `TROPHY_KINDS` so any kind added in
 * lib/points.ts auto-appears in the right tier section.
 */
export function TrophyGallerySection() {
  return (
    <section>
      <SectionLabel className="text-center">Every nugget &amp; gem</SectionLabel>
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
        The full collection
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        Hover any nugget to watch it shimmer. Rarity climbs from raw bronze to
        uncut gemstones.
      </p>

      <div className="mt-10 space-y-12">
        {TIER_GROUPS.map(({ tier, label }) => {
          const kinds = TROPHY_KINDS.filter((k) => TROPHY_META[k].tier === tier);
          if (kinds.length === 0) return null;
          return (
            <div key={tier}>
              <SectionLabel className="mb-5">{label}</SectionLabel>
              <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {kinds.map((kind) => {
                  const meta = TROPHY_META[kind];
                  const points = POINTS[kind];
                  return (
                    <li key={kind}>
                      <Card
                        className={cn(
                          "group flex h-full flex-col items-start",
                          cardHoverLift,
                        )}
                      >
                        <div className="group-hover:animate-gem-shimmer">
                          <TrophyIcon
                            name={meta.icon}
                            tier={meta.tier}
                            size="lg"
                          />
                        </div>
                        <h3 className="mt-4 font-semibold">{meta.label}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {meta.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-foreground/80">
                          +{points} pts
                        </span>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Closing CTA block listing the four contribution types and their
 * point rewards. Numbers come from `POINTS` so they stay in sync
 * if the values change in lib/points.ts.
 */
export function ContributeSection() {
  return (
    <section>
      <SectionLabel className="text-center">
        Anyone at Temple of the Sun can contribute
      </SectionLabel>
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
        Add a plugin, skill, course, or article
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <BigNumber>{POINTS.plugin_contributed}</BigNumber>
          <p className="mt-2 text-sm text-muted-foreground">
            Points for adding a plugin. Name, description, and a GitHub link.
          </p>
        </Card>
        <Card>
          <BigNumber>{POINTS.skill_contributed}</BigNumber>
          <p className="mt-2 text-sm text-muted-foreground">
            Points for adding a skill. Name, description, GitHub link.
          </p>
        </Card>
        <Card>
          <BigNumber>{POINTS.course_contributed}</BigNumber>
          <p className="mt-2 text-sm text-muted-foreground">
            Points for adding a course. Title, URL, provider.
          </p>
        </Card>
        <Card>
          <BigNumber>{POINTS.article_contributed}</BigNumber>
          <p className="mt-2 text-sm text-muted-foreground">
            Points for adding an article. Title, URL, author.
          </p>
        </Card>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
        Your real name is shown next to everything you add, so people know who
        to thank.
      </p>
    </section>
  );
}

function HowCard({
  icon,
  title,
  body,
  points,
  pointsLabel,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  points: number;
  pointsLabel: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <BigNumber className="text-2xl">+{points}</BigNumber>
        <span className="text-xs text-muted-foreground">{pointsLabel}</span>
      </div>
    </Card>
  );
}
