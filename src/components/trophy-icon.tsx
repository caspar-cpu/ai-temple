import {
  Award,
  BookOpen,
  Check,
  FilePlus,
  GraduationCap,
  Rocket,
  Sparkles,
  Star,
  Target,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UncutGem } from "@/components/uncut-gem";

const ICONS: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Check,
  FilePlus,
  GraduationCap,
  Rocket,
  Sparkles,
  Star,
  Target,
  Wrench,
  Zap,
};

const TIER_STYLES = {
  bronze:
    "rounded-full bg-gradient-to-br from-amber-200 to-amber-700/80 text-amber-900 ring-1 ring-amber-800/30 shadow-sm",
  silver:
    "rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400/80 text-zinc-700 ring-1 ring-zinc-500/30 shadow-sm",
  gold: "rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600/80 text-yellow-900 ring-1 ring-yellow-700/30 shadow-sm",
} as const;

export function TrophyIcon({
  name,
  tier,
  size = "md",
  animate = false,
}: {
  name: string;
  tier: "bronze" | "silver" | "gold" | "special";
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}) {
  const box =
    size === "lg" ? "size-10" : size === "sm" ? "size-6" : "size-8";
  const icon = size === "lg" ? "size-5" : size === "sm" ? "size-3" : "size-4";

  if (tier === "special") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          box,
          animate && "animate-gem-shimmer",
        )}
        style={animate ? { transformStyle: "preserve-3d" } : undefined}
      >
        <UncutGem name={name} className="size-full" />
      </span>
    );
  }

  const Icon = ICONS[name] ?? Award;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        TIER_STYLES[tier],
        box,
        animate && "animate-gem-shimmer",
      )}
      style={animate ? { transformStyle: "preserve-3d" } : undefined}
    >
      <Icon className={icon} />
    </span>
  );
}
