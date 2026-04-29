import Link from "next/link";
import {
  BookOpen,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { BigNumber, Card, SectionLabel } from "@/components/ui/card";
import { SunHorizon } from "@/components/sun-horizon";
import { TrophyStack } from "@/components/trophy-stack";
import { cardHoverLift, linkFocusRing } from "@/lib/style";
import { cn } from "@/lib/utils";

type Section = {
  href: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const SECTIONS: Section[] = [
  {
    href: "/start-here",
    title: "Start here",
    body: "The beginner journey. Seven lessons, mined one step at a time.",
    icon: Sparkles,
  },
  {
    href: "/plugins",
    title: "Plugins",
    body: "Claude skills installed once, used by everyone.",
    icon: Wrench,
  },
  {
    href: "/skills",
    title: "Skills",
    body: "Marketplace skills that ship a single capability.",
    icon: Sparkles,
  },
  {
    href: "/ai-tools",
    title: "AI Tools",
    body: "The 2026 field guide, pyramid-ordered.",
    icon: Compass,
  },
  {
    href: "/courses",
    title: "Courses",
    body: "Long-form learning. The biggest single nuggets.",
    icon: GraduationCap,
  },
  {
    href: "/articles",
    title: "Articles",
    body: "Curated reading. Bronze nuggets per read.",
    icon: BookOpen,
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    body: "Top miners and the latest activity.",
    icon: Layers,
  },
];

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = user.full_name?.split(" ")[0] ?? "miner";
  const greeting = timeOfDayGreeting();
  const supabase = await createClient();

  const [trophiesRes, rankRes] = await Promise.all([
    supabase
      .from("user_trophies")
      .select("id, kind, points, earned_at")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false }),
    supabase
      .from("leaderboard")
      .select("id, total_points")
      .order("total_points", { ascending: false }),
  ]);

  const trophies = trophiesRes.data ?? [];
  const totalPoints = trophies.reduce((sum, t) => sum + t.points, 0);
  const rank =
    (rankRes.data ?? []).findIndex((r) => r.id === user.id) + 1 || null;
  const recentTrophies = trophies.slice(0, 5);

  return (
    <div className="space-y-14">
      <header className="text-center">
        <SunHorizon className="mx-auto h-24 w-full max-w-md" />
        <SectionLabel className="mt-4">The AI Temple</SectionLabel>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          {greeting}, {firstName}.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Apply plugins. Read articles. Mine nuggets and gemstones. Your path is
          your own.
        </p>
        <p className="mt-4">
          <Link
            href={`/u/${user.username}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            View your profile →
          </Link>
        </p>
      </header>

      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-3 flex items-baseline justify-between">
          <SectionLabel>Your latest</SectionLabel>
          {trophies.length > 5 && (
            <Link
              href={`/u/${user.username}`}
              className="text-xs text-muted-foreground hover:text-bead-blue"
            >
              See all {trophies.length} →
            </Link>
          )}
        </div>
        <Card>
          <TrophyStack trophies={recentTrophies} />
        </Card>
      </section>

      <section className="mx-auto w-full max-w-2xl">
        <Card className="grid grid-cols-1 divide-y divide-border p-0 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Link
            href={`/u/${user.username}`}
            className="px-6 py-5 text-center transition hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:outline-none"
          >
            <SectionLabel>Points</SectionLabel>
            <BigNumber className="mt-2 text-3xl">{totalPoints}</BigNumber>
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-5 text-center transition hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:outline-none"
          >
            <SectionLabel>Rank</SectionLabel>
            <BigNumber className="mt-2 text-3xl">
              {rank ? `#${rank}` : "—"}
            </BigNumber>
          </Link>
          <Link
            href={`/u/${user.username}`}
            className="px-6 py-5 text-center transition hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:outline-none"
          >
            <SectionLabel>Nuggets &amp; gems</SectionLabel>
            <BigNumber className="mt-2 text-3xl">{trophies.length}</BigNumber>
          </Link>
        </Card>
      </section>

      <section>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isNavStyle =
              s.href === "/start-here" || s.href === "/leaderboard";
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={cn("block h-full", linkFocusRing)}
                >
                  <Card className={cn("h-full", cardHoverLift)}>
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        isNavStyle ? "bg-bead-blue/10" : "bg-primary/10",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5",
                          isNavStyle ? "text-bead-blue" : "text-primary",
                        )}
                      />
                    </div>
                    <h3 className="mt-4 font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.body}
                    </p>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
