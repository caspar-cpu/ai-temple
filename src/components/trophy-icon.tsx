import { cn } from "@/lib/utils";
import { Gemstone } from "@/components/gemstone";
import { Nugget } from "@/components/nugget";

type GemKind =
  | "ruby"
  | "sapphire"
  | "emerald"
  | "citrine"
  | "garnet"
  | "diamond";

const GEM_KINDS: Record<string, GemKind> = {
  Ruby: "ruby",
  Sapphire: "sapphire",
  Emerald: "emerald",
  Citrine: "citrine",
  Garnet: "garnet",
  Diamond: "diamond",
};

function variantFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Dispatcher: renders a Nugget for bronze/silver/gold tiers and a
 * Gemstone for special tier (gem kind looked up by `name`). The
 * canonical entry point — use this anywhere an achievement visual
 * should appear, never Nugget/Gemstone directly.
 *
 * @param name TROPHY_META.icon string (e.g. "Zap" for nuggets, "Citrine" for gems)
 * @param tier bronze/silver/gold render as Nugget; special renders as Gemstone
 * @param size sm (size-7), md (size-9), lg (size-12)
 * @param animate apply the gem-shimmer (3D rotation) on render
 */
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
    size === "lg" ? "size-12" : size === "sm" ? "size-7" : "size-9";

  const wrapperClasses = cn(
    "inline-flex items-center justify-center drop-shadow-sm",
    box,
    animate && "animate-gem-shimmer",
  );
  const wrapperStyle = animate ? { transformStyle: "preserve-3d" as const } : undefined;

  if (tier === "special") {
    const kind = GEM_KINDS[name] ?? "diamond";
    return (
      <span className={wrapperClasses} style={wrapperStyle}>
        <Gemstone kind={kind} className="size-full" />
      </span>
    );
  }

  return (
    <span className={wrapperClasses} style={wrapperStyle}>
      <Nugget
        tone={tier}
        variant={variantFromString(name)}
        className="size-full"
      />
    </span>
  );
}
