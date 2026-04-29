import Link from "next/link";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Contributor = {
  full_name: string;
  username: string;
} | null;

/**
 * Pill linking to the contributor's profile, shown next to plugin/skill
 * cards to credit who added the entry. Renders nothing when `contributor`
 * is null (e.g. seeded entries with no attribution).
 */
export function ContributorTag({
  contributor,
  className,
}: {
  contributor: Contributor;
  className?: string;
}) {
  if (!contributor) return null;
  return (
    <Link
      href={`/u/${contributor.username}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/10 hover:text-foreground",
        className,
      )}
    >
      <UserPlus className="size-3" />
      {contributor.full_name}
    </Link>
  );
}
