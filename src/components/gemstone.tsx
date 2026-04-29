type GemKind =
  | "ruby"
  | "sapphire"
  | "emerald"
  | "citrine"
  | "garnet"
  | "diamond";

type Palette = {
  light: string;
  mid: string;
  dark: string;
  shadow: string;
  glint: string;
};

const PALETTES: Record<GemKind, Palette> = {
  ruby: {
    light: "#FF94A4",
    mid: "#D42943",
    dark: "#7A0F22",
    shadow: "#4A0A18",
    glint: "#FFD8DD",
  },
  sapphire: {
    light: "#A4C0E8",
    mid: "#3A66B0",
    dark: "#1A2F60",
    shadow: "#0B1838",
    glint: "#E0EAF8",
  },
  emerald: {
    light: "#A4E6B8",
    mid: "#2F9F5A",
    dark: "#155029",
    shadow: "#082A14",
    glint: "#DEF5E6",
  },
  citrine: {
    light: "#FFE89A",
    mid: "#E0A52A",
    dark: "#8E6010",
    shadow: "#523808",
    glint: "#FFF6D8",
  },
  garnet: {
    light: "#E8849A",
    mid: "#A22842",
    dark: "#5A0F22",
    shadow: "#330812",
    glint: "#F8C8D2",
  },
  diamond: {
    light: "#F4F8FC",
    mid: "#C0CFD8",
    dark: "#7A8995",
    shadow: "#3F4A52",
    glint: "#FFFFFF",
  },
};

export function Gemstone({
  kind,
  className,
}: {
  kind: GemKind;
  className?: string;
}) {
  const p = PALETTES[kind];
  const id = kind;

  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gem-${id}-base`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="55%" stopColor={p.mid} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id={`gem-${id}-side`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={p.dark} />
          <stop offset="100%" stopColor={p.mid} />
        </linearGradient>
      </defs>

      {/* Outer raw-gem silhouette: asymmetric octagon — wider at the top
          crown, tapering toward a pavilion below. */}
      <path
        d="M 12 5 L 24 5 L 31 11 L 30 22 L 22 30 L 14 30 L 6 22 L 5 11 Z"
        fill={`url(#gem-${id}-base)`}
        stroke={p.shadow}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />

      {/* Crown table — bright top facet */}
      <path
        d="M 12 5 L 24 5 L 22 11 L 14 11 Z"
        fill={p.light}
        opacity="0.65"
      />

      {/* Upper side facets */}
      <path
        d="M 12 5 L 14 11 L 6 11 L 5 11 Z"
        fill={p.mid}
        opacity="0.55"
      />
      <path
        d="M 24 5 L 22 11 L 31 11 L 31 11 Z"
        fill={p.dark}
        opacity="0.4"
      />

      {/* Middle band — light/dark contrast */}
      <path
        d="M 6 11 L 14 11 L 14 22 L 5 11 Z"
        fill={p.mid}
        opacity="0.35"
      />
      <path
        d="M 22 11 L 30 11 L 31 22 L 22 22 Z"
        fill={p.dark}
        opacity="0.45"
      />

      {/* Pavilion facets meeting at the point */}
      <path
        d="M 14 22 L 22 22 L 22 30 L 18 30 Z"
        fill={p.mid}
        opacity="0.45"
      />
      <path
        d="M 14 22 L 18 30 L 14 30 L 6 22 Z"
        fill={p.dark}
        opacity="0.55"
      />
      <path
        d="M 22 22 L 30 22 L 22 30 L 18 30 Z"
        fill={p.dark}
        opacity="0.4"
      />

      {/* Bright glint catching the light on the crown */}
      <path
        d="M 14 6 L 17 5.5 L 16 9 L 13.5 9 Z"
        fill={p.glint}
        opacity="0.8"
      />
      <ellipse cx="20" cy="8" rx="1.4" ry="0.8" fill={p.glint} opacity="0.5" />

      {/* Subtle internal facet line for depth */}
      <line
        x1="14"
        y1="22"
        x2="22"
        y2="22"
        stroke={p.shadow}
        strokeWidth="0.3"
        opacity="0.5"
      />
      <line
        x1="14"
        y1="11"
        x2="22"
        y2="11"
        stroke={p.shadow}
        strokeWidth="0.3"
        opacity="0.45"
      />
    </svg>
  );
}
