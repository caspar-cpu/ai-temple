"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SunMark } from "@/components/sun-mark";
import { cn } from "@/lib/utils";

type Row = {
  id: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  total_points: number | null;
};

export function LeaderboardSidebar({
  rows,
  currentUserId,
}: {
  rows: Row[];
  currentUserId: string | null;
}) {
  const [open, setOpen] = useState(true);
  const visible = rows.filter(
    (r): r is Row & { id: string; username: string; full_name: string } =>
      !!r.id && !!r.username && !!r.full_name,
  );

  return (
    <aside
      className={cn(
        "sticky top-0 h-dvh shrink-0 border-l border-border bg-muted/30 transition-all",
        open ? "w-64" : "w-10",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-center border-b border-border text-muted-foreground hover:text-foreground"
        aria-label={open ? "Collapse leaderboard" : "Expand leaderboard"}
      >
        <ChevronRight
          className={cn(
            "size-4 transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {open && (
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <SunMark className="size-3.5 text-primary" />
            Top miners
          </div>

          <ol className="space-y-1">
            {visible.map((row, i) => {
              const isMe = row.id === currentUserId;
              return (
                <li key={row.id}>
                  <Link
                    href={`/u/${row.username}`}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-full px-3 py-1.5 text-sm transition",
                      "hover:bg-background",
                      isMe && "bg-background font-medium",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0 text-right text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="truncate">{row.full_name}</span>
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {row.total_points ?? 0}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <Link
            href="/leaderboard"
            className="mt-3 block text-xs text-muted-foreground hover:text-foreground"
          >
            View full leaderboard →
          </Link>
        </div>
      )}
    </aside>
  );
}
