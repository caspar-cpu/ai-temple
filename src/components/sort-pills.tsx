import Link from "next/link";
import { cn } from "@/lib/utils";

export type SortOption = { value: string; label: string };

/**
 * Server-driven sort selector. Each option is a `<Link>` to the same
 * route with a `?sort=` query param (omitted for the default option to
 * keep canonical URLs clean). `preserved` carries forward unrelated
 * params (e.g. category, search) across selections.
 */
export function SortPills({
  basePath,
  currentSort,
  defaultSort,
  options,
  preserved = {},
}: {
  basePath: string;
  currentSort: string;
  defaultSort: string;
  options: SortOption[];
  preserved?: Record<string, string | undefined>;
}) {
  function buildHref(value: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(preserved)) {
      if (v) params.set(k, v);
    }
    if (value !== defaultSort) params.set("sort", value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Sort
      </span>
      {options.map((o) => {
        const active = currentSort === o.value;
        return (
          <Link
            key={o.value}
            href={buildHref(o.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground/80 hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Type-safe `?sort=` validator. Returns the value if it matches one of
 * the allowed strings, otherwise the fallback. Use in server components
 * after `searchParams` to narrow string → union literal.
 */
export function resolveSort<T extends string>(
  value: string | undefined,
  valid: readonly T[],
  fallback: T,
): T {
  return (valid as readonly string[]).includes(value ?? "")
    ? (value as T)
    : fallback;
}
