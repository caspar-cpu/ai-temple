"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAMS } from "@/lib/teams";

/**
 * "Team specific" dropdown in the top nav. Renders the menu in a body
 * portal so it escapes overflow:hidden ancestors, anchored to the
 * trigger via a fixed-position style computed from getBoundingClientRect.
 * Closes on outside click, Escape, or page scroll. The `mounted` flag
 * gates the portal until after first client render so SSR doesn't
 * touch document.body.
 */
export function TeamsMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mount flag: portal target (document.body) only exists on client.
    // Standard hydration-safe portal pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScroll() {
      setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition",
          open
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background text-foreground/80 hover:border-foreground/40 hover:text-foreground",
        )}
      >
        <Menu className="size-3.5" />
        Team specific
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {mounted && open &&
        createPortal(
          <div
            ref={menuRef}
            className="w-72 rounded-2xl border border-border bg-card shadow-2xl"
            style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 50 }}
          >
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Team specific AI
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick your team for 3 tailored articles.
              </p>
            </div>
            <ul className="max-h-96 overflow-y-auto py-2">
              {TEAMS.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.slug}>
                    <Link
                      href={`/teams/${t.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <span>{t.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border/60 px-4 py-2">
              <Link
                href="/teams"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-bead-blue"
              >
                See all teams →
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
