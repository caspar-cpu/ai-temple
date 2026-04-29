"use client";

import { trophyMeta } from "@/lib/points";
import { TrophyIcon } from "@/components/trophy-icon";
import { SunMark } from "@/components/sun-mark";
import { formatRelative } from "@/lib/utils";

type TrophyItem = {
  id: string;
  kind: string;
  points: number;
  earned_at: string;
};

const SIZE = 48;
const OFFSET = 22;

/**
 * Overlapping fan of nuggets/gems, newest first. Each tile shows the
 * trophy meta on hover (label · points · relative time) and triggers
 * the gem-shimmer animation. Renders an empty-state nudge when the
 * user has no trophies yet. Used on the home dashboard and profile.
 */
export function TrophyStack({ trophies }: { trophies: TrophyItem[] }) {
  if (trophies.length === 0) {
    return (
      <div className="flex items-start gap-3">
        <SunMark className="mt-0.5 size-6 shrink-0 text-primary/70" />
        <p className="text-sm text-muted-foreground">
          No nuggets yet — apply a plugin, read an article, or tick off a Start
          Here step to mine your first.
        </p>
      </div>
    );
  }

  const sorted = [...trophies].sort((a, b) =>
    b.earned_at.localeCompare(a.earned_at),
  );
  const width = (sorted.length - 1) * OFFSET + SIZE;

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="relative"
        style={{ width: Math.max(width, SIZE), height: SIZE + 4 }}
      >
        {sorted.map((t, i) => {
          const meta = trophyMeta(t.kind);
          return (
            <div
              key={t.id}
              className="absolute transition-transform hover:z-50 hover:animate-gem-shimmer"
              style={{
                left: `${i * OFFSET}px`,
                top: 0,
                zIndex: sorted.length - i,
                transformStyle: "preserve-3d",
              }}
              title={`${meta.label} · +${t.points} · ${formatRelative(t.earned_at)}`}
            >
              <TrophyIcon name={meta.icon} tier={meta.tier} size="lg" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
