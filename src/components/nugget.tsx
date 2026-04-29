type Tone = "gold" | "silver" | "bronze";

const TONES: Record<
  Tone,
  { light: string; mid: string; dark: string; shadow: string; glint: string }
> = {
  gold: {
    light: "#FFE38A",
    mid: "#E2B140",
    dark: "#9C7019",
    shadow: "#5C4012",
    glint: "#FFF6D6",
  },
  silver: {
    light: "#F4F4F4",
    mid: "#C8C8C8",
    dark: "#7B7B7B",
    shadow: "#3D3D3D",
    glint: "#FFFFFF",
  },
  bronze: {
    light: "#E8B789",
    mid: "#B97742",
    dark: "#6E3F1A",
    shadow: "#3E2410",
    glint: "#FBE2C5",
  },
};

/**
 * A cartoon-realistic metal nugget illustration. Three irregular pebble
 * shapes are picked by `variant` (any integer; modulo 3 selects the path)
 * so a list of nuggets reads as varied rather than identical.
 *
 * @param tone "gold" | "silver" | "bronze" — picks the radial gradient palette
 * @param variant any integer (e.g. a hash of the kind/name) for shape variety
 * @param className size + color overrides via Tailwind utilities
 */
export function Nugget({
  tone,
  className,
  variant = 0,
}: {
  tone: Tone;
  className?: string;
  variant?: number;
}) {
  const t = TONES[tone];
  const id = `${tone}-${variant}`;

  // Three irregular nugget silhouettes — picked by `variant` to vary the
  // shape across many entries on a page. Each is a closed bezier path that
  // reads as an asymmetric pebble pulled from the ground.
  const shapes = [
    "M 8 16 C 6 10 11 5 17 4 C 24 3 30 7 30 14 C 31 22 26 28 19 28 C 12 29 9 23 8 16 Z",
    "M 6 18 C 5 12 9 6 16 5 C 23 4 30 9 31 16 C 31 24 25 29 18 29 C 11 30 7 24 6 18 Z",
    "M 10 14 C 7 9 13 4 19 4 C 26 4 31 10 31 17 C 31 25 25 30 17 29 C 12 28 11 21 10 14 Z",
  ];

  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`g-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={t.light} />
          <stop offset="55%" stopColor={t.mid} />
          <stop offset="100%" stopColor={t.dark} />
        </radialGradient>
      </defs>
      <path
        d={shapes[variant % shapes.length]}
        fill={`url(#g-${id})`}
        stroke={t.shadow}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Surface bumps — short bezier lines suggesting irregular metal */}
      <path
        d="M 13 12 q 2 -1 4 0"
        stroke={t.shadow}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />
      <path
        d="M 18 22 q 3 -1 5 0"
        stroke={t.shadow}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M 11 21 q 1 1 3 1"
        stroke={t.shadow}
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
        fill="none"
      />
      {/* Highlight — a kidney-shaped glint suggesting polished metal */}
      <path
        d="M 14 10 Q 17 8 19 11 Q 17 14 13 13 Z"
        fill={t.glint}
        opacity="0.7"
      />
      <ellipse cx="22" cy="14" rx="1.6" ry="1" fill={t.glint} opacity="0.5" />
    </svg>
  );
}
