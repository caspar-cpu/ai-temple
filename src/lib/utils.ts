import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind class composer: clsx for conditionals + tailwind-merge to
 * dedupe conflicting utilities (e.g. `p-4 p-6` → `p-6`). Use this
 * instead of template strings whenever variant logic is involved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * URL-slug from a free-form string. Lowercases, strips non-word
 * chars, collapses whitespace and double hyphens. Use for content
 * slugs (plugin/skill/article/course names).
 */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Read a count out of Supabase's nested `{count}` shape: PostgREST
 * returns `[{count: N}]` for `.select("col(count)")` joins. Returns
 * 0 when the join is empty or shape is unexpected.
 */
export function extractCount(nested: unknown): number {
  const arr = nested as { count: number }[] | undefined;
  return arr?.[0]?.count ?? 0;
}

/**
 * Whether a profile was created within the given window (default 5 minutes).
 * Used to show a special "Welcome to The AI Temple" greeting on first visit.
 */
export function isJustJoined(createdAt: string, withinMs = 5 * 60_000) {
  return Date.now() - new Date(createdAt).getTime() < withinMs;
}

/**
 * Friendly greeting bucketed by hour of `now` (server's clock). Used
 * on the home dashboard above the user's first name.
 */
export function timeOfDayGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * 1-based ordinal of `userId` in a leaderboard ordered by points-desc,
 * or null if absent. Wraps the `findIndex + 1 || null` idiom so call
 * sites read declaratively.
 */
export function rankOf(
  rows: { id: string | null }[],
  userId: string,
): number | null {
  const idx = rows.findIndex((r) => r.id === userId);
  return idx >= 0 ? idx + 1 : null;
}

/**
 * Human-readable "X ago" string. Tiers: just now (<1m), Xm ago (<1h),
 * Xh ago (<24h), Xd ago (<30d), then a localized full date. Used on
 * trophy timestamps and contributor activity.
 */
export function formatRelative(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}
