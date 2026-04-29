/**
 * Hero illustration: a half-disc sun rising over a thin horizon line,
 * with a soft radial haze and 9 radiating rays. Uses theme tokens
 * `--primary` and `--foreground` so it re-skins with the palette. Used
 * on every public surface (home, /about, /login, /auth/error, /not-found).
 */
export function SunHorizon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 110"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="sun-haze" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
          <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        x="40"
        y="20"
        width="240"
        height="60"
        fill="url(#sun-haze)"
        className="sun-haze"
      />

      <line
        x1="0"
        y1="80"
        x2="320"
        y2="80"
        stroke="hsl(var(--foreground))"
        strokeWidth="0.6"
        opacity="0.35"
      />

      <path
        d="M 122 80 A 38 38 0 0 1 198 80"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.8"
        opacity="0.45"
      />

      <path
        d="M 130 80 A 30 30 0 0 1 190 80 Z"
        fill="hsl(var(--primary))"
      />

      <g
        stroke="hsl(var(--primary))"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <line x1="160" y1="32" x2="160" y2="20" />
        <line x1="180" y1="35.4" x2="184" y2="28.4" />
        <line x1="140" y1="35.4" x2="136" y2="28.4" />
        <line x1="194.6" y1="50" x2="201.6" y2="46" />
        <line x1="125.4" y1="50" x2="118.4" y2="46" />
      </g>

      <g
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      >
        <line x1="170" y1="33" x2="172" y2="26" />
        <line x1="150" y1="33" x2="148" y2="26" />
        <line x1="187.5" y1="42.5" x2="192.5" y2="37.5" />
        <line x1="132.5" y1="42.5" x2="127.5" y2="37.5" />
      </g>
    </svg>
  );
}
