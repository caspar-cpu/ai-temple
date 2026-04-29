import Link from "next/link";
import { cn } from "@/lib/utils";

export type SortOption = { value: string; label: string };

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

export function resolveSort<T extends string>(
  value: string | undefined,
  valid: readonly T[],
  fallback: T,
): T {
  return (valid as readonly string[]).includes(value ?? "")
    ? (value as T)
    : fallback;
}
