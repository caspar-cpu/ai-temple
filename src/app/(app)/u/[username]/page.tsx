import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel, BigNumber } from "@/components/ui/card";
import { TrophyStack } from "@/components/trophy-stack";
import { SunProgress } from "@/components/sun-progress";
import { CopyButton } from "@/components/copy-button";
import { SunMark } from "@/components/sun-mark";
import { trophyMeta } from "@/lib/points";
import { cardHoverLift, linkFocusRing } from "@/lib/style";
import { cn } from "@/lib/utils";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();
  const isMe = currentUser.username === username;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (!profile) notFound();

  const [
    trophiesRes,
    rankRes,
    pluginsRes,
    pluginUsesRes,
    pluginCountRes,
    articleCountRes,
    courseCountRes,
  ] = await Promise.all([
    supabase
      .from("user_trophies")
      .select("id, kind, points, earned_at")
      .eq("user_id", profile.id)
      .order("earned_at", { ascending: false }),
    supabase
      .from("leaderboard")
      .select("id, total_points")
      .order("total_points", { ascending: false }),
    supabase
      .from("plugins")
      .select("id, slug, name, description")
      .eq("contributor_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("plugin_uses")
      .select("plugin_id", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase.from("plugins").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
  ]);

  const trophies = trophiesRes.data ?? [];
  const totalPoints = trophies.reduce((sum, t) => sum + t.points, 0);
  const rank =
    (rankRes.data ?? []).findIndex((r) => r.id === profile.id) + 1 || null;
  const plugins = pluginsRes.data ?? [];

  const tierCounts = trophies.reduce<Record<string, number>>((acc, t) => {
    const tier = trophyMeta(t.kind).tier;
    acc[tier] = (acc[tier] ?? 0) + 1;
    return acc;
  }, {});
  const gemCount = tierCounts.special ?? 0;

  const pluginsUsed = pluginUsesRes.count ?? 0;
  const masteryReached = pluginsUsed >= 25;
  const nextMilestone =
    pluginsUsed < 5 ? 5 : pluginsUsed < 10 ? 10 : pluginsUsed < 25 ? 25 : 25;
  const milestoneCaption = masteryReached
    ? "Sapphire of mastery achieved — 25 plugins applied."
    : `${nextMilestone - pluginsUsed} more to ${
        nextMilestone === 5
          ? "a silver nugget (5 plugins)"
          : nextMilestone === 10
            ? "a gold nugget (10 plugins)"
            : "the Sapphire of mastery (25 plugins)"
      }.`;

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={64}
            height={64}
            className="gem-hex size-16 object-cover"
          />
        ) : (
          <div className="gem-hex flex size-16 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30 font-display text-2xl font-semibold text-foreground/80">
            {profile.full_name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          {isMe && (
            <div className="flex items-center gap-1.5">
              <SunMark className="size-3 text-bead-blue" />
              <SectionLabel>Welcome back</SectionLabel>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {profile.full_name}
            </h1>
            {profile.is_admin && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            @{profile.username}
            {profile.department && ` · ${profile.department}`}
          </p>
        </div>
        {isMe && (
          <div className="flex shrink-0 items-center gap-3">
            <CopyButton
              text={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-temple-eta.vercel.app"}/u/${profile.username}`}
              label="Copy link"
            />
            <Link
              href="/settings"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-bead-blue hover:underline"
            >
              Edit profile
            </Link>
          </div>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <SectionLabel>Points</SectionLabel>
          <BigNumber className="mt-3">{totalPoints}</BigNumber>
        </Card>
        <Card>
          <SectionLabel>Rank</SectionLabel>
          <BigNumber className="mt-3">{rank ? `#${rank}` : "-"}</BigNumber>
        </Card>
        <Card>
          <SectionLabel>Nuggets &amp; gems</SectionLabel>
          <BigNumber className="mt-3">{trophies.length}</BigNumber>
          {trophies.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground tabular-nums">
              {tierCounts.bronze ?? 0} bronze · {tierCounts.silver ?? 0} silver
              · {tierCounts.gold ?? 0} gold · {gemCount}{" "}
              {gemCount === 1 ? "gem" : "gems"}
            </p>
          )}
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-1.5">
          <SunMark className="size-3 text-primary" />
          <SectionLabel>Path to mastery</SectionLabel>
        </div>
        <Card className="flex items-center gap-6">
          <SunProgress
            done={masteryReached ? 25 : pluginsUsed}
            total={25}
            size={112}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-semibold tabular-nums">{pluginsUsed}</span>{" "}
              {pluginsUsed === 1 ? "plugin" : "plugins"} applied
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {milestoneCaption}
            </p>
          </div>
        </Card>
      </section>

      <section>
        <SectionLabel className="mb-4">Nuggets &amp; gems</SectionLabel>
        <Card>
          <TrophyStack trophies={trophies} />
          {trophies.length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              Hover any nugget to watch it shimmer. Newest at the front.
            </p>
          )}
        </Card>
      </section>

      {isMe && (
        <section>
          <SectionLabel className="mb-3">Keep exploring</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-3">
            <ExploreCard
              label="Plugins"
              count={pluginCountRes.count ?? 0}
              href="/plugins"
            />
            <ExploreCard
              label="Articles"
              count={articleCountRes.count ?? 0}
              href="/articles"
            />
            <ExploreCard
              label="Courses"
              count={courseCountRes.count ?? 0}
              href="/courses"
            />
          </div>
        </section>
      )}

      {plugins.length > 0 && (
        <section>
          <SectionLabel className="mb-3">Plugins contributed</SectionLabel>
          <ul className="space-y-3">
            {plugins.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/plugins/${p.slug}`}
                  className={cn("block", linkFocusRing)}
                >
                  <Card className={cardHoverLift}>
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ExploreCard({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link href={href} className={cn("block", linkFocusRing)}>
      <Card className={cardHoverLift}>
        <SectionLabel>{label}</SectionLabel>
        <BigNumber className="mt-3">{count}</BigNumber>
        <p className="mt-3 text-sm text-muted-foreground">Browse →</p>
      </Card>
    </Link>
  );
}
