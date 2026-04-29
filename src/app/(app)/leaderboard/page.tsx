import Link from "next/link";
import { Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { SortPills, resolveSort } from "@/components/sort-pills";
import { SunMark } from "@/components/sun-mark";
import { TrophyIcon } from "@/components/trophy-icon";
import { trophyMeta } from "@/lib/points";
import { cn, formatRelative } from "@/lib/utils";

type RecentTrophy = {
  id: string;
  kind: string;
  points: number;
  earned_at: string;
  profile: { full_name: string; username: string } | null;
};

const PERIODS = ["month", "last-month", "all-time"] as const;
type Period = (typeof PERIODS)[number];

type Row = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  department: string | null;
  total_points: number;
  trophy_count: number;
};

function monthBounds(offset: number): { start: Date; end: Date; label: string } {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1),
  );
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset + 1, 1),
  );
  const label = start.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return { start, end, label };
}

async function loadRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  period: Period,
): Promise<{ rows: Row[]; label: string }> {
  if (period === "all-time") {
    const { data } = await supabase
      .from("leaderboard")
      .select("*")
      .order("total_points", { ascending: false });
    const rows = (data ?? [])
      .filter((r) => !!r.id && !!r.full_name && !!r.username)
      .map((r) => ({
        id: r.id as string,
        full_name: r.full_name as string,
        username: r.username as string,
        avatar_url: r.avatar_url,
        department: r.department,
        total_points: r.total_points ?? 0,
        trophy_count: r.trophy_count ?? 0,
      })) as Row[];
    return { rows, label: "All time" };
  }

  const { start, end, label } = monthBounds(period === "last-month" ? -1 : 0);
  const { data } = await supabase.rpc("leaderboard_in_range", {
    p_start: start.toISOString(),
    p_end: end.toISOString(),
  });
  return {
    rows: (data ?? []) as Row[],
    label,
  };
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const period = resolveSort(sortParam, PERIODS, "month");

  const user = await getCurrentUser();
  const supabase = await createClient();

  const [{ rows, label }, recentRes] = await Promise.all([
    loadRows(supabase, period),
    supabase
      .from("user_trophies")
      .select(
        "id, kind, points, earned_at, profile:profiles(full_name, username)",
      )
      .order("earned_at", { ascending: false })
      .limit(8),
  ]);
  const recent = ((recentRes.data ?? []) as unknown as RecentTrophy[]).filter(
    (t) => t.profile && t.profile.username,
  );
  const myRank = rows.findIndex((r) => r.id === user.id) + 1 || null;
  const winner = rows[0];
  const rest = rows.slice(1);

  const winnerHeading =
    period === "all-time"
      ? "All-time leader"
      : period === "last-month"
        ? `${label} winner`
        : `${label} so far`;

  return (
    <div className="space-y-8">
      <header>
        <SectionLabel>Leaderboard</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Top miners
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {label}. {rows.length} {rows.length === 1 ? "person" : "people"} on
          the board.
        </p>
      </header>

      <SortPills
        basePath="/leaderboard"
        currentSort={period}
        defaultSort="month"
        options={[
          { value: "month", label: "This month" },
          { value: "last-month", label: "Last month" },
          { value: "all-time", label: "All time" },
        ]}
      />

      {winner ? (
        <Card className="bg-amber-50">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-200/70">
              <SunMark className="size-8 animate-sun-shine text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-800">
                {winnerHeading}
              </p>
              <Link
                href={`/u/${winner.username}`}
                className="mt-1 block truncate text-2xl font-semibold tracking-tight hover:underline"
              >
                {winner.full_name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {winner.total_points} points · {winner.trophy_count}{" "}
                {winner.trophy_count === 1 ? "nugget" : "nuggets"}
                {winner.department && ` · ${winner.department}`}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-4 py-10 text-center">
          <SunMark className="size-10 text-primary/70" />
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {period === "last-month"
                ? "Nobody mined last month"
                : "The board is dark"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {period === "month"
                ? "No nuggets earned this month yet. Apply a plugin or read an article to be the first to light it up."
                : period === "last-month"
                  ? "Last month came and went without a nugget."
                  : "No one has earned a single nugget. The first to do so will rise."}
            </p>
          </div>
          {period !== "last-month" && (
            <Button href="/start-here" className="mt-2">
              Start mining
            </Button>
          )}
        </Card>
      )}

      {rest.length > 0 && (
        <Card className="p-0">
          <ol className="divide-y divide-border">
            {rest.map((row, i) => {
              const rank = i + 2;
              const isMe = row.id === user.id;
              return (
                <li
                  key={row.id}
                  className={cn(
                    "flex items-center gap-4 px-6 py-3 text-sm",
                    isMe && "bg-muted/40",
                  )}
                >
                  <span className="w-8 text-right tabular-nums text-muted-foreground">
                    {rank}
                  </span>
                  <Link
                    href={`/u/${row.username}`}
                    className="flex-1 font-medium hover:underline"
                  >
                    {row.full_name}
                  </Link>
                  {row.department && (
                    <span className="hidden rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground sm:inline">
                      {row.department}
                    </span>
                  )}
                  <span className="inline-flex w-16 items-center justify-end gap-1 text-xs tabular-nums text-muted-foreground">
                    <Trophy className="size-3" />
                    {row.trophy_count}
                  </span>
                  <span className="w-16 text-right font-semibold tabular-nums">
                    {row.total_points}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {!myRank && rows.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          You are not on this period&apos;s board yet.
        </p>
      )}

      {recent.length > 0 && (
        <section>
          <SectionLabel className="mb-3">Recently mined</SectionLabel>
          <Card className="p-0">
            <ul className="divide-y divide-border">
              {recent.map((t) => {
                const meta = trophyMeta(t.kind);
                if (!t.profile) return null;
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-6 py-3 text-sm"
                  >
                    <TrophyIcon
                      name={meta.icon}
                      tier={meta.tier}
                      size="sm"
                    />
                    <Link
                      href={`/u/${t.profile.username}`}
                      className="font-medium hover:underline"
                    >
                      {t.profile.full_name}
                    </Link>
                    <span className="truncate text-muted-foreground">
                      earned{" "}
                      <span className="text-foreground/80">{meta.label}</span>
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground tabular-nums">
                      <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/70">
                        +{t.points}
                      </span>
                      <span className="hidden sm:inline">
                        {formatRelative(t.earned_at)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
