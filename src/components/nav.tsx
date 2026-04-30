import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SunMark } from "@/components/sun-mark";
import { TeamsMenu } from "@/components/teams-menu";
import type { Database } from "@/types/db";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/plugins", label: "Plugins" },
  { href: "/skills", label: "Skills" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/courses", label: "Courses" },
  { href: "/articles", label: "Articles" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/how-it-works", label: "How it works" },
];

/**
 * Two-tier sticky header. Top row: the SunMark logo + identity strip
 * (display name link, Settings, Sign out). Second row (signed-in only):
 * a horizontal scroll rail of section links with the bead-blue
 * "Start here" pill leading + the TeamsMenu trailing. Hidden entirely
 * for signed-out visitors so /login and /about stay clean.
 */
export function Nav({ user }: { user: Profile | null }) {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur md:px-8">
        <Link
          href="/"
          aria-label="The AI Temple home"
          className="group flex items-center gap-3"
        >
          <SunMark className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden font-display text-base tracking-wide sm:inline">
            The AI Temple
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <Link
              href={`/u/${user.username}`}
              className="hidden text-sm text-muted-foreground hover:text-bead-blue sm:inline"
            >
              {user.full_name}
            </Link>
            <Link
              href="/settings"
              className="hidden text-sm text-muted-foreground hover:text-bead-blue sm:inline"
              aria-label="Settings"
            >
              Settings
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="secondary" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        )}
      </header>

      {user && (
        <div className="flex h-12 items-center gap-2 overflow-x-auto border-b border-border/60 bg-muted/30 px-6 md:px-8">
          <Button
            href="/start-here"
            variant="peacock"
            size="sm"
            className="shrink-0"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Start here
          </Button>
          {LINKS.map((l) => (
            <Button
              key={l.href}
              variant="tertiary"
              size="sm"
              href={l.href}
              className="shrink-0"
            >
              {l.label}
            </Button>
          ))}
          <TeamsMenu />
          <span className="flex-1" />
        </div>
      )}
    </>
  );
}
