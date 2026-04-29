import Link from "next/link";
import { SunHorizon } from "@/components/sun-horizon";

/**
 * Centered single-card layout for unauthenticated/error surfaces:
 * SunHorizon hero on top, the page's content (typically a Card) in the
 * middle, and a small editorial wordmark linking to /about at the
 * bottom. Used by /login, /auth/error, and /not-found.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-6">
      <SunHorizon className="mb-6 h-20 w-full max-w-sm" />
      {children}
      <Link
        href="/about"
        className="mt-8 font-display text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70 transition hover:text-muted-foreground"
      >
        The AI Temple
      </Link>
    </main>
  );
}
