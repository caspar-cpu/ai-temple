import Link from "next/link";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Contributor = {
  full_name: string;
  username: string;
} | null;

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
