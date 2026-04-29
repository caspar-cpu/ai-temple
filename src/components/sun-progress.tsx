type Props = {
  done: number;
  total: number;
  size?: number;
};

export function SunProgress({ done, total, size = 128 }: Props) {
  const pct = total > 0 ? done / total : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const center = 64;

  const rayCoords = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * Math.PI) / 4;
    const inner = 28;
    const outer = 38;
    return {
      x1: center + Math.sin(angle) * inner,
      y1: center - Math.cos(angle) * inner,
      x2: center + Math.sin(angle) * outer,
      y2: center - Math.cos(angle) * outer,
    };
  });

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${done} of ${total} steps complete`}
    >
      <svg
        viewBox="0 0 128 128"
        fill="none"
        className="absolute inset-0 size-full"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="4"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <g
          stroke="hsl(var(--primary))"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          {rayCoords.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              opacity={i / 8 < pct ? 1 : 0.18}
              className="transition-opacity duration-700"
            />
          ))}
        </g>
        <circle
          cx={center}
          cy={center}
          r="14"
          fill="hsl(var(--primary))"
          className={pct >= 1 ? "animate-sun-shine" : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-base font-semibold tabular-nums text-primary-foreground mix-blend-difference">
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}
