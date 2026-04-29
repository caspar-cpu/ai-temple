type Hue = { light: string; dark: string; glint: string };

const HUES: Record<string, Hue> = {
  Citrine: { light: "#FFE189", dark: "#C28A1F", glint: "#FFF4C7" },
  Garnet: { light: "#C24B58", dark: "#6B0F1F", glint: "#E89AA3" },
  Sapphire: { light: "#6B92D6", dark: "#1A3568", glint: "#B5D0F0" },
  Ruby: { light: "#E2435A", dark: "#7A0A1F", glint: "#F4A3B0" },
};

const DEFAULT_HUE: Hue = {
  light: "#E0D4FF",
  dark: "#5B47A8",
  glint: "#F2EBFF",
};

export function UncutGem({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const hue = HUES[name] ?? DEFAULT_HUE;
  const gradientId = `gem-${name}`;

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={hue.light} />
          <stop offset="100%" stopColor={hue.dark} />
        </linearGradient>
      </defs>
      <path
        d="M 16 3 L 26 11 L 23 26 L 9 26 L 6 11 Z"
        fill={`url(#${gradientId})`}
        stroke={hue.dark}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path d="M 16 3 L 16 14 L 6 11 Z" fill={hue.light} opacity="0.45" />
      <path d="M 16 3 L 16 14 L 26 11 Z" fill={hue.dark} opacity="0.28" />
      <path d="M 16 14 L 6 11 L 9 26 Z" fill={hue.dark} opacity="0.18" />
      <path d="M 16 14 L 26 11 L 23 26 Z" fill={hue.dark} opacity="0.12" />
      <path d="M 16 14 L 9 26 L 23 26 Z" fill={hue.light} opacity="0.32" />
      <path
        d="M 11 8 L 13 10 L 12 13 L 9 12 Z"
        fill={hue.glint}
        opacity="0.75"
      />
    </svg>
  );
}
